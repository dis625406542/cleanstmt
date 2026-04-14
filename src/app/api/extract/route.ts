import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";

// ---------- security: only allow POST ----------
export const runtime = "nodejs";

const MAX_BODY_SIZE = 20 * 1024 * 1024; // 20 MB
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
11. Return ONLY valid JSON (no markdown, no commentary).`;

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

const SUMMARY_VERIFY_PROMPT = `Re-read the SAME document image and verify ONLY totals/summary values with strict digit accuracy.

Rules:
1. Return ONLY this JSON shape: {"summary":[{"label":"...","value":"..."}]}
2. Copy each summary value exactly as printed (currency symbol, commas, decimals, sign).
3. Read numbers character-by-character and do not infer.
4. If unsure, use empty string "".
5. No markdown, no extra text.`;

function normalizeLabel(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function looksLikeNumericValue(s: string): boolean {
  const t = (s || "").trim();
  return /\d/.test(t) && (/[$€£¥]/.test(t) || /[\d.,()%+-]/.test(t));
}

function parseSummaryFromText(rawText: string): { label: string; value: string }[] | null {
  let txt = rawText.trim();
  if (txt.startsWith("```")) {
    txt = txt.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  try {
    const parsed = JSON.parse(txt) as { summary?: { label?: string; value?: string }[] };
    if (!Array.isArray(parsed.summary)) return null;
    return parsed.summary.map((s) => ({
      label: String(s?.label ?? ""),
      value: String(s?.value ?? ""),
    }));
  } catch {
    return null;
  }
}

function parseMoneyLoose(value: string): number | null {
  const s = (value || "").trim();
  if (!s) return null;
  const negativeByParen = s.startsWith("(") && s.endsWith(")");
  const cleaned = s.replace(/[,$€£¥%\s]/g, "").replace(/[()]/g, "");
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return null;
  return negativeByParen ? -Math.abs(num) : num;
}

function extractPercentFromLabel(label: string): number | null {
  const m = label.match(/(\d+(?:\.\d+)?)\s*%/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function shouldVerifySummary(summary: { label: string; value: string }[]): boolean {
  if (!summary || summary.length === 0) return false;

  // Missing/empty values should always trigger verification.
  if (summary.some((s) => !String(s.value ?? "").trim())) return true;

  const map = new Map<string, number>();
  let taxRate: number | null = null;

  for (const s of summary) {
    const key = normalizeLabel(s.label);
    const val = parseMoneyLoose(String(s.value ?? ""));
    if (val === null) continue;
    map.set(key, val);
    if (taxRate === null && key.includes("tax")) {
      const p = extractPercentFromLabel(s.label);
      if (p !== null) taxRate = p;
    }
  }

  const subtotal =
    map.get("subtotal") ??
    map.get("sub total") ??
    map.get("sub-total");
  const discount =
    map.get("discount") ??
    map.get("discount amount");
  const tax =
    map.get("tax") ??
    map.get("tax amount") ??
    map.get("vat");
  const total =
    map.get("total") ??
    map.get("amount due") ??
    map.get("amount payable") ??
    map.get("balance due");

  // If we have enough fields, check arithmetic consistency.
  if (subtotal !== undefined && total !== undefined) {
    const expected = subtotal + (discount ?? 0) + (tax ?? 0);
    if (Math.abs(expected - total) > 0.05) return true;
  }

  // If tax rate is present, verify tax amount against subtotal.
  if (subtotal !== undefined && tax !== undefined && taxRate !== null) {
    const expectedTax = (subtotal * taxRate) / 100;
    if (Math.abs(expectedTax - tax) > 0.1) return true;
  }

  return false;
}

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
        { error: "File too large. Maximum 20 MB." },
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
    let summary = Array.isArray(parsed.summary) ? parsed.summary : [];

    // 7. Second-pass verification for summary amounts (only when risky/inconsistent)
    if (shouldVerifySummary(summary)) {
      try {
        const verifyPass = await callWithFallback(SUMMARY_VERIFY_PROMPT, usedModel);
        usedModel = verifyPass.usedModel;
        const verifyTextBlock = verifyPass.response.content.find((b) => b.type === "text");
        if (verifyTextBlock && verifyTextBlock.type === "text") {
          const verifiedSummary = parseSummaryFromText(verifyTextBlock.text);
          if (verifiedSummary && verifiedSummary.length > 0) {
            const byLabel = new Map(
              verifiedSummary.map((s) => [normalizeLabel(s.label), s.value])
            );
            summary = summary.map((s) => {
              const key = normalizeLabel(s.label);
              const verifiedValue = byLabel.get(key);
              if (!verifiedValue) return s;
              if (!verifiedValue.trim()) return s;
              if (s.value === verifiedValue) return s;
              if (looksLikeNumericValue(s.value) || looksLikeNumericValue(verifiedValue)) {
                return { ...s, value: verifiedValue };
              }
              return s;
            });
            if (summary.length === 0) {
              summary = verifiedSummary;
            }
          }
        }
      } catch (verifyErr) {
        // Verification is best-effort; keep first-pass output if verify fails.
        const verifyMsg =
          verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
        console.warn("Summary verify pass failed:", verifyMsg.slice(0, 180));
      }
    }

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
