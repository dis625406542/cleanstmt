"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import FileDropzone, { type UploadedFile } from "@/components/app/FileDropzone";
import SnippetPaste from "@/components/app/SnippetPaste";
import ProcessingState from "@/components/app/ProcessingState";
import { generateId } from "@/lib/utils";

type PageState = "idle" | "processing" | "done" | "error";
type ProcessingStep = "uploading" | "extracting" | "cleaning" | "done";

async function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const [prefix, base64] = dataUrl.split(",");
      const mediaType = prefix.match(/:(.*?);/)?.[1] ?? file.type;
      resolve({ base64, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("idle");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("uploading");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const runExtraction = useCallback(
    async (base64: string, mediaType: string) => {
      setPageState("processing");
      setProcessingStep("uploading");

      try {
        setProcessingStep("extracting");
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Extraction failed");
        }

        setProcessingStep("cleaning");
        sessionStorage.setItem("extractResult", JSON.stringify(data));

        setProcessingStep("done");
        setPageState("done");
        router.push("/app/review");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setErrorMessage(msg);
        setPageState("error");
      }
    },
    [router]
  );

  const handleFilesAccepted = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;

      const newFiles: UploadedFile[] = files.map((f) => ({
        id: generateId(),
        file: f,
        status: "pending" as const,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      const { base64, mediaType } = await fileToBase64(file);
      await runExtraction(base64, mediaType);
    },
    [runExtraction]
  );

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleImagePasted = useCallback(
    async (dataUrl: string, blob: Blob) => {
      const [prefix, base64] = dataUrl.split(",");
      const mediaType = prefix.match(/:(.*?);/)?.[1] ?? blob.type;
      await runExtraction(base64, mediaType);
    },
    [runExtraction]
  );

  if (pageState === "error") {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Extraction Failed</h1>
        <p className="mb-6 text-sm text-red-600">{errorMessage}</p>
        <button
          onClick={() => { setPageState("idle"); setUploadedFiles([]); }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (pageState === "processing" || pageState === "done") {
    return (
      <div>
        <h1 className="mb-8 text-2xl font-bold text-gray-900">
          Processing Your Statement
        </h1>
        <ProcessingState currentStep={processingStep} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Two-column: Upload + Snippet side by side */}
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <FileDropzone
          onFilesAccepted={handleFilesAccepted}
          uploadedFiles={uploadedFiles}
          onRemoveFile={handleRemoveFile}
        />
        <SnippetPaste onImagePasted={handleImagePasted} />
      </div>

      {/* Security banner */}
      <div className="mt-6 flex items-center gap-3 rounded-lg bg-brand-50 px-5 py-3 ring-1 ring-brand-200/60">
        <Shield className="h-4 w-4 shrink-0 text-brand-600" />
        <p className="text-sm text-brand-800">
          <span className="font-semibold">Bank-grade encryption.</span> Files
          processed in-memory and auto-deleted after 1 hour. Zero permanent
          storage.
        </p>
      </div>

      {/* Quick start */}
      <div className="mt-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Quick Start
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Upload or Paste",
              desc: "Drag a PDF or paste a screenshot of your bank statement.",
            },
            {
              step: "2",
              title: "AI Extracts Data",
              desc: "Our AI reads every row, removes merged cells, and structures the data.",
            },
            {
              step: "3",
              title: "Export Clean Data",
              desc: "Download as Excel, QuickBooks CSV, or copy to clipboard.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-xl border border-surface-200 bg-white p-5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-600">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
