"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import FileDropzone, { type UploadedFile } from "@/components/app/FileDropzone";
import SnippetPaste from "@/components/app/SnippetPaste";
import ProcessingState from "@/components/app/ProcessingState";
import { generateId } from "@/lib/utils";

type PageState = "idle" | "processing" | "done";
type ProcessingStep = "uploading" | "extracting" | "cleaning" | "done";

export default function DashboardPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("idle");
  const [processingStep, setProcessingStep] =
    useState<ProcessingStep>("uploading");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const simulateProcessing = useCallback(() => {
    setPageState("processing");
    setProcessingStep("uploading");

    setTimeout(() => setProcessingStep("extracting"), 1200);
    setTimeout(() => setProcessingStep("cleaning"), 2800);
    setTimeout(() => {
      setProcessingStep("done");
      setPageState("done");
      setTimeout(() => router.push("/app/review"), 800);
    }, 4200);
  }, [router]);

  const handleFilesAccepted = useCallback(
    (files: File[]) => {
      const newFiles: UploadedFile[] = files.map((file) => ({
        id: generateId(),
        file,
        status: "pending" as const,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      simulateProcessing();
    },
    [simulateProcessing]
  );

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleImagePasted = useCallback(
    (_dataUrl: string, _blob: Blob) => {
      simulateProcessing();
    },
    [simulateProcessing]
  );

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
