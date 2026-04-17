import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";

// ---------- security: only allow POST ----------
export const runtime = "nodejs";

const MAX_BODY_SIZE = 10 * 1024 * 1024; // 10 MB
const DEFAULT_MAX_TOKENS = 12000;
const MAX_ALLOWED_TOKENS = 12000;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

type AllowedMediaType = (typeof ALLOWED_TYPES)[number];

function isAllowedType(t: string): t is AllowedMediaType {
  return (ALLOWED_TYPES as readonly string[]).includes(t);
}

// ---------- Claude extraction prompt ----------
const SYSTEM_PROMPT = `You are a world-class financial document OCR and data extraction engine built for CPAs and bookkeepers.

Your mission: extract ALL information from financial documents (bank statements, invoices, receipts, etc.) into a structured JSON that preserves the original document's visual layout and grouping.

Strict rules:
1. Identify the document type automatically.
2. Detect visual layout and grouping from the actual page structure.
3. Section titles and table headers must come from the document text; never invent names.
4. Side-by-side groups use layout "side-by-side"; vertical groups use layout "list".
5. Preserve original table column names exactly and keep every row in order.
6. Extract totals/summary lines separately.
7. Preserve original currency symbols, signs, and number/date formatting.
8. Monetary accuracy is critical: for every amount/number in header, rows, and summary, read digit-by-digit and copy exactly from the document text.
9. Never "correct", round, or infer numeric values. Do not swap similar digits (5/9, 3/8, 0/6, 1/7).
10. If any digit is uncertain, return empty string "" for that value instead of guessing.
11. Return ONLY valid JSON (no markdown, no commentary).
12. "summary" must contain ONLY numeric totals/subtotals/tax/discount lines at the bottom of the document. Payment method blocks, bank info, contact info, or any non-numeric descriptive groups must go into "sections", never into "summary".`;

const USER_PROMPT_BASE = `Analyze this financial document image. Extract ALL information into a JSON object with these 5 sections:

1. "header": top-level document identifiers (document number, date, etc.)
   Format: [{"label": "Invoice No", "value": "000456"}, {"label": "Date", "value": "January 1, 2022"}]
   Only include fields that are standalone identifiers at the top of the document.

2. "sections": grouped descriptive blocks that appear BEFORE the main data table.
   Each section object has:
   - "layout": "side-by-side" if multiple groups appear next to each other horizontally (e.g. BILL TO on the left, FROM on the right), or "list" if a single group appears vertically.
   - "groups": array of group objects, each with:
     - "title": the section heading as shown in the document (e.g. "BILL TO", "FROM", "Payment Method")
     - "items": array of values. For plain text lines use strings: ["Street Address", "City, State, ZIP"]. For labeled fields use objects: [{"label": "Bank Name", "value": "Bank of America"}].

3. "columns": array of the ORIGINAL column names from the document's main data table, exactly as shown.

4. "rows": array of arrays, each inner array contains cell values matching the columns order.

5. "summary": totals/summary lines below the data table.
   Format: [{"label": "Subtotal", "value": "$702.50"}, {"label": "Tax 10%", "value": "$59.71"}]

Return ONLY the raw JSON object.`;


// ---------- handler ----------
export async function POST(request: NextRequest) {
  // 1. Rate limiting by IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const { ok, remaining } = checkRateLimit(ip);

  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
      }
    );
  }

  // 2. Check API credentials are configured
  const apiKey = process.env.ANTHROPIC_AUTH_TOKEN;
  const baseURL = process.env.ANTHROPIC_BASE_URL;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
  const fallbackModels = (process.env.ANTHROPIC_FALLBACK_MODELS || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  const maxTokensRaw = Number(process.env.ANTHROPIC_MAX_TOKENS || DEFAULT_MAX_TOKENS);
  const maxTokens = Number.isFinite(maxTokensRaw)
    ? Math.min(MAX_ALLOWED_TOKENS, Math.max(800, Math.trunc(maxTokensRaw)))
    : DEFAULT_MAX_TOKENS;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API credentials not configured on server." },
      { status: 500 }
    );
  }

  // 3. Parse and validate request body
  let body: { image: string; mediaType: string; columns?: string[] };
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 10 MB." },
        { status: 413 }
      );
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { image, mediaType, columns } = body;

  if (!image || typeof image !== "string") {
    return NextResponse.json(
      { error: "Missing image data." },
      { status: 400 }
    );
  }

  if (!mediaType || !isAllowedType(mediaType)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use PNG, JPEG, or WebP." },
      { status: 400 }
    );
  }

  // Strip data URL prefix if present
  const base64Data = image.includes(",") ? image.split(",")[1] : image;

  if (!base64Data || base64Data.length < 100) {
    return NextResponse.json(
      { error: "Image data appears empty or corrupted." },
      { status: 400 }
    );
  }

  // 4. Build prompt with optional custom columns
  let userPrompt = USER_PROMPT_BASE;
  if (columns && columns.length > 0) {
    userPrompt = `Analyze this financial document image. Extract ALL information into a JSON object with these 5 sections:

1. "header": top-level document identifiers. Format: [{"label": "...", "value": "..."}]

2. "sections": grouped descriptive blocks before the data table. Each section has:
   - "layout": "side-by-side" or "list"
   - "groups": [{"title": "...", "items": [...]}]
   Items can be plain strings or {"label": "...", "value": "..."} objects.

3. "columns": use EXACTLY these column names: ${JSON.stringify(columns)}

4. "rows": array of arrays matching the columns order.

5. "summary": totals lines. Format: [{"label": "...", "value": "..."}]

Return ONLY the raw JSON object.`;
  }

  // 5. Call Claude Vision API via configured endpoint
  try {
    const client = new Anthropic({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    });

    const createMessage = (modelName: string, promptText: string) =>
      client.messages.create({
        model: modelName,
        max_tokens: maxTokens,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: "text",
                text: promptText,
              },
            ],
          },
        ],
        system: SYSTEM_PROMPT,
      });

    const callWithFallback = async (promptText: string, preferredModel?: string) => {
      let selectedModel = preferredModel || model;
      let resp: Awaited<ReturnType<typeof createMessage>>;
      try {
        resp = await createMessage(selectedModel, promptText);
        return { response: resp, usedModel: selectedModel };
      } catch (firstErr: unknown) {
        const firstMessage = firstErr instanceof Error ? firstErr.message : String(firstErr);
        const modelUnsupported =
          firstMessage.includes("support the requested model") ||
          firstMessage.includes("unsupported model");

        if (!modelUnsupported || fallbackModels.length === 0) {
          throw firstErr;
        }

        for (const fallback of fallbackModels) {
          if (fallback === selectedModel) continue;
          try {
            resp = await createMessage(fallback, promptText);
            return { response: resp, usedModel: fallback };
          } catch {
            // continue to next fallback
          }
        }
        throw firstErr;
      }
    };

    const firstPass = await callWithFallback(userPrompt);
    let usedModel = firstPass.usedModel;
    const response = firstPass.response;

    // 6. Parse Claude's response
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI." },
        { status: 502 }
      );
    }

    let rawText = textBlock.text.trim();

    // Strip markdown code fences if Claude wraps them
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let parsed: {
      header?: { label: string; value: string }[];
      sections?: { layout: string; groups: { title: string; items: unknown[] }[] }[];
      metadata?: { label: string; value: string }[];
      columns?: string[];
      rows?: string[][];
      summary?: { label: string; value: string }[];
    };

    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: "AI returned invalid data format. Please try again.",
          raw: rawText.slice(0, 500),
        },
        { status: 502 }
      );
    }

    // Handle legacy flat array format
    if (Array.isArray(parsed)) {
      const cols = parsed.length > 0 ? Object.keys(parsed[0]) : [];
      const rows = parsed.map((row: Record<string, string>) =>
        cols.map((c) => row[c] ?? "")
      );
      return NextResponse.json(
        { header: [], sections: [], columns: cols, rows, summary: [] },
        {
          status: 200,
          headers: {
            "X-RateLimit-Remaining": String(remaining),
            "X-AI-Model": usedModel,
            "Cache-Control": "no-store",
          },
        }
      );
    }

    // Backwards-compat: convert old "metadata" to new "header" + "sections"
    let header = Array.isArray(parsed.header) ? parsed.header : [];
    let sections = Array.isArray(parsed.sections) ? parsed.sections : [];
    if (header.length === 0 && sections.length === 0 && Array.isArray(parsed.metadata) && parsed.metadata.length > 0) {
      header = parsed.metadata;
      sections = [];
    }

    const extractedColumns = Array.isArray(parsed.columns) ? parsed.columns : [];
    const extractedRows = Array.isArray(parsed.rows) ? parsed.rows : [];
    const summary = Array.isArray(parsed.summary) ? parsed.summary : [];

    return NextResponse.json(
      {
        header,
        sections,
        columns: extractedColumns,
        rows: extractedRows,
        summary,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(remaining),
          "X-AI-Model": usedModel,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    // Never leak internal details to the client
    console.error("Claude API error:", message);

    if (message.includes("authentication") || message.includes("401")) {
      return NextResponse.json(
        { error: "AI service authentication failed. Check server configuration." },
        { status: 500 }
      );
    }

    if (message.includes("rate") || message.includes("429")) {
      return NextResponse.json(
        { error: "AI service rate limit reached. Please try again in a moment." },
        { status: 429 }
      );
    }

    if (message.includes("support the requested model") || message.includes("unsupported model")) {
      return NextResponse.json(
        {
          error:
            "Configured model is not supported by your provider. Please update ANTHROPIC_MODEL to one supported by your account.",
          details: message.slice(0, 240),
        },
        { status: 400 }
      );
    }

    if (message.toLowerCase().includes("max_tokens")) {
      return NextResponse.json(
        {
          error: "Configured ANTHROPIC_MAX_TOKENS is invalid for this provider/model.",
          details: message.slice(0, 240),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "AI extraction failed. Please try again.", details: message.slice(0, 240) },
      { status: 500 }
    );
  }
}
