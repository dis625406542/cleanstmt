"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import Image from "next/image";
import { CloudUpload, Clipboard, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  onImagePasted: (dataUrl: string, blob: Blob) => void;
  onFileTooLarge?: (sizeInMB: number) => void;
}

export default function UploadZone({
  onFileAccepted,
  onImagePasted,
  onFileTooLarge,
}: UploadZoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoLoadHandledRef = useRef(false);
  const [loadingExample, setLoadingExample] = useState(false);

  const handleLoadExample = useCallback(async () => {
    if (loadingExample) return;
    setLoadingExample(true);
    try {
      const res = await fetch("/demo.png");
      const blob = await res.blob();
      const file = new File([blob], "demo.png", { type: "image/png" });
      onFileAccepted(file);
    } catch (err) {
      console.error("Failed to load example:", err);
    } finally {
      setLoadingExample(false);
    }
  }, [loadingExample, onFileAccepted]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFileAccepted(accepted[0]);
    },
    [onFileAccepted]
  );

  const onDropRejected = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const first = rejectedFiles[0];
      if (first?.errors.some((e) => e.code === "file-too-large")) {
        const sizeInMB = Math.round((first.file.size / (1024 * 1024)) * 10) / 10;
        onFileTooLarge?.(sizeInMB);
      }
    },
    [onFileTooLarge]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          if (!blob) continue;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            onImagePasted(dataUrl, blob);
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener("paste", handlePaste as EventListener);
    return () => {
      if (el) el.removeEventListener("paste", handlePaste as EventListener);
    };
  }, [onImagePasted]);

  useEffect(() => {
    if (autoLoadHandledRef.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("example") !== "1") return;

    autoLoadHandledRef.current = true;
    void handleLoadExample();

    // Avoid re-triggering on refresh while keeping the current anchor position.
    params.delete("example");
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [handleLoadExample]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="flex flex-1 outline-none"
    >
      {/* Left: compact upload / paste area */}
      <div className="flex w-[240px] shrink-0 flex-col items-center justify-center p-5 xl:w-[280px]">
        <div
          {...getRootProps()}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-all",
            isDragActive
              ? "border-brand-500 bg-brand-50/40"
              : "border-navy-200 bg-navy-50/30 hover:border-navy-300 hover:bg-navy-50/60"
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              "mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              isDragActive
                ? "bg-brand-100 text-brand-600"
                : "bg-navy-100 text-navy-400"
            )}
          >
            <CloudUpload className="h-5 w-5" />
          </div>
          <p className="text-[13px] font-semibold text-navy-800">
            Drop Image / PDF
          </p>
          <p className="mt-1 text-[11px] text-navy-400">
            Or{" "}
            <kbd className="rounded border border-navy-200 bg-white px-1 py-0.5 font-mono text-[10px] text-navy-500">
              Ctrl+V
            </kbd>{" "}
            paste
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-navy-400">
            <Clipboard className="h-2.5 w-2.5" />
            Paste supported
          </div>
          <span className="text-navy-200">|</span>
          <span className="text-[10px] text-navy-400">Max 10 MB</span>
        </div>

        {/* Load Example button */}
        <button
          onClick={handleLoadExample}
          disabled={loadingExample}
          className={cn(
            "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-200",
            loadingExample
              ? "cursor-not-allowed border-navy-100 bg-navy-50 text-navy-300"
              : "border-brand-200 bg-brand-50/60 text-brand-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800 active:scale-[0.98]"
          )}
        >
          {loadingExample ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {loadingExample ? "Loading…" : "Try an Example"}
        </button>
      </div>

      {/* Right: large demo mockup preview */}
      <div className="hidden flex-1 flex-col items-center justify-center border-l border-surface-200 bg-surface-100/60 p-5 lg:flex">
        <div className="mb-3 flex items-center gap-1.5">
          <ArrowRight className="h-3 w-3 text-brand-500" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-navy-400">
            Output Preview
          </span>
        </div>
        <div className="w-full max-w-[460px] overflow-hidden rounded-lg border border-surface-300 bg-white shadow-card">
          <Image
            src="/mock.png"
            alt="Bank statement to Excel conversion demo"
            width={460}
            height={380}
            className="w-full object-cover"
            priority
          />
        </div>
        <p className="mt-3 text-center text-[10px] leading-relaxed text-navy-400">
          PDF → Clean Excel with separated columns, no merged cells.
        </p>
      </div>
    </div>
  );
}
