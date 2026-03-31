"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { Clipboard, Image, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnippetPasteProps {
  onImagePasted: (imageData: string, blob: Blob) => void;
}

export default function SnippetPaste({ onImagePasted }: SnippetPasteProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const zoneRef = useRef<HTMLDivElement>(null);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
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
            setPreview(dataUrl);
            onImagePasted(dataUrl, blob);
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    },
    [onImagePasted]
  );

  useEffect(() => {
    const el = zoneRef.current;
    if (!el) return;
    el.addEventListener("paste", handlePaste as EventListener);
    return () => el.removeEventListener("paste", handlePaste as EventListener);
  }, [handlePaste]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clipboard className="h-4 w-4 text-brand-500" />
        <h3 className="text-sm font-semibold text-navy-700">Snippet Mode</h3>
      </div>

      <div
        ref={zoneRef}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all outline-none",
          preview
            ? "border-brand-300 bg-brand-50/30"
            : isFocused
            ? "border-brand-400 bg-brand-50/30"
            : "border-navy-200 bg-white hover:border-navy-300"
        )}
      >
        {preview ? (
          <div className="relative w-full p-4">
            <button
              onClick={() => setPreview(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 shadow-elevated hover:bg-navy-50"
            >
              <X className="h-3.5 w-3.5 text-navy-500" />
            </button>
            <img
              src={preview}
              alt="Pasted screenshot"
              className="mx-auto max-h-40 rounded-lg border border-navy-200 object-contain"
            />
            <p className="mt-3 text-center text-xs font-medium text-brand-600">
              Screenshot captured. Ready to extract.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-400">
              <Image className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-navy-600">
              Paste your screenshot here
            </p>
            <p className="mt-1 text-xs text-navy-400">
              Click here first, then press{" "}
              <kbd className="rounded border border-navy-200 bg-navy-50 px-1.5 py-0.5 font-mono text-[10px] text-navy-500">
                Ctrl+V
              </kbd>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
