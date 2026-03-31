"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import UploadZone from "./UploadZone";
import PreviewConfig, { type ExtractConfig } from "./PreviewConfig";
import ProcessingView from "./ProcessingView";
import ResultView from "./ResultView";

export type ToolStep = "upload" | "preview" | "processing" | "result";

export interface UploadedItem {
  name: string;
  type: "pdf" | "image";
  previewUrl: string | null;
  blob: Blob | null;
}

export interface SectionGroup {
  title: string;
  items: (string | { label: string; value: string })[];
}

export interface DocSection {
  layout: "side-by-side" | "list";
  groups: SectionGroup[];
}

export interface ExtractResult {
  header: { label: string; value: string }[];
  sections: DocSection[];
  columns: string[];
  rows: string[][];
  summary: { label: string; value: string }[];
}

interface ToolPanelProps {
  onStepChange?: (step: ToolStep) => void;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getMediaType(blob: Blob): string {
  const t = blob.type;
  if (t === "image/png" || t === "image/jpeg" || t === "image/webp" || t === "image/gif") return t;
  if (t === "application/pdf") return "image/png";
  return "image/png";
}

export default function ToolPanel({ onStepChange }: ToolPanelProps) {
  const [step, setStep] = useState<ToolStep>("upload");
  const [uploadedItem, setUploadedItem] = useState<UploadedItem | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const handleFileAccepted = useCallback(async (file: File) => {
    const isImage = file.type.startsWith("image/");

    if (isImage) {
      setUploadedItem({
        name: file.name,
        type: "image",
        previewUrl: URL.createObjectURL(file),
        blob: file,
      });
      setStep("preview");
    } else {
      setUploadedItem({
        name: file.name,
        type: "pdf",
        previewUrl: null,
        blob: file,
      });
      setStep("preview");

      try {
        const { renderPdfFirstPage } = await import("@/lib/pdf-preview");
        const dataUrl = await renderPdfFirstPage(file);
        setUploadedItem((prev) =>
          prev ? { ...prev, previewUrl: dataUrl } : prev
        );
      } catch (err) {
        console.error("PDF preview failed:", err);
      }
    }
  }, []);

  const handleImagePasted = useCallback((dataUrl: string, blob: Blob) => {
    setUploadedItem({
      name: "Screenshot.png",
      type: "image",
      previewUrl: dataUrl,
      blob,
    });
    setStep("preview");
  }, []);

  const handleStartExtract = useCallback(
    async (config: ExtractConfig) => {
      if (!uploadedItem?.blob && !uploadedItem?.previewUrl) return;

      setError(null);
      setStep("processing");

      try {
        abortRef.current = new AbortController();

        // For PDFs, we send the rendered preview image; for images, the original
        let imageData: string;
        if (uploadedItem.previewUrl?.startsWith("data:")) {
          imageData = uploadedItem.previewUrl;
        } else if (uploadedItem.blob) {
          imageData = await blobToBase64(uploadedItem.blob);
        } else {
          throw new Error("No image data available");
        }

        const mediaType = uploadedItem.previewUrl?.startsWith("data:image/png")
          ? "image/png"
          : uploadedItem.blob
            ? getMediaType(uploadedItem.blob)
            : "image/png";

        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageData,
            mediaType,
            columns: config.columns.length > 0 ? config.columns : undefined,
          }),
          signal: abortRef.current.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Server error (${res.status})`);
        }

        if (!data.columns || !data.rows) {
          throw new Error("Invalid response format");
        }

        setResult({
          header: data.header || [],
          sections: data.sections || [],
          columns: data.columns,
          rows: data.rows,
          summary: data.summary || [],
        });
        setStep("result");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Extraction failed";
        setError(msg);
        setStep("preview");
      }
    },
    [uploadedItem]
  );

  const handleRestart = useCallback(() => {
    setUploadedItem(null);
    setResult(null);
    setError(null);
    setStep("upload");
  }, []);

  const handleBack = useCallback(() => {
    setError(null);
    if (step === "preview") {
      setStep("upload");
    } else if (step === "result") {
      setStep("preview");
    }
  }, [step]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-300 bg-white shadow-modal ring-1 ring-black/[0.03]">
      {/* Error banner */}
      {error && step === "preview" && (
        <div className="flex items-center gap-2 border-b border-red-200 bg-red-50 px-5 py-2.5">
          <span className="text-xs font-medium text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs font-medium text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {step === "upload" && (
        <UploadZone
          onFileAccepted={handleFileAccepted}
          onImagePasted={handleImagePasted}
        />
      )}
      {step === "preview" && uploadedItem && (
        <PreviewConfig
          item={uploadedItem}
          onStart={handleStartExtract}
          onBack={handleBack}
        />
      )}
      {step === "processing" && <ProcessingView />}
      {step === "result" && uploadedItem && result && (
        <ResultView
          item={uploadedItem}
          result={result}
          onResultChange={setResult}
          onBack={handleBack}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
