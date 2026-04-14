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

function dataUrlToMediaType(dataUrl: string): string | null {
  const m = dataUrl.match(/^data:([^;]+);base64,/);
  return m?.[1] ?? null;
}

async function compressImageBlobIfNeeded(blob: Blob): Promise<Blob> {
  if (!blob.type.startsWith("image/")) return blob;

  const maxDim = 1400;
  const minBytesForCompress = 350 * 1024;
  if (blob.size < minBytesForCompress) return blob;

  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image for compression"));
      image.src = url;
    });

    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    if (scale >= 1 && blob.type !== "image/png") return blob;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return blob;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const outType = "image/jpeg";
    const outBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, 0.72)
    );
    if (!outBlob) return blob;

    // Keep original when compressed result is not smaller.
    return outBlob.size < blob.size ? outBlob : blob;
  } catch {
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
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
        let mediaType = "image/png";
        if (uploadedItem.previewUrl?.startsWith("data:")) {
          // Re-compress data URL previews (especially PDF renders/pasted images) to reduce payload.
          const previewBlob = await (await fetch(uploadedItem.previewUrl)).blob();
          const optimizedBlob = await compressImageBlobIfNeeded(previewBlob);
          imageData = await blobToBase64(optimizedBlob);
          mediaType = getMediaType(optimizedBlob);
        } else if (uploadedItem.type === "pdf" && uploadedItem.blob) {
          // Ensure PDFs are always converted to a rendered image before inference.
          const { renderPdfFirstPage } = await import("@/lib/pdf-preview");
          imageData = await renderPdfFirstPage(uploadedItem.blob as File);
          mediaType = dataUrlToMediaType(imageData) || "image/jpeg";
        } else if (uploadedItem.blob) {
          const optimizedBlob = await compressImageBlobIfNeeded(uploadedItem.blob);
          imageData = await blobToBase64(optimizedBlob);
          mediaType = getMediaType(optimizedBlob);
        } else {
          throw new Error("No image data available");
        }

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
