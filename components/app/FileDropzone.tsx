"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, File, X, Loader2 } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
}

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

export default function FileDropzone({
  onFilesAccepted,
  uploadedFiles,
  onRemoveFile,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesAccepted(accepted);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
          isDragActive
            ? "border-brand-500 bg-brand-50/50"
            : "border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/50"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
            isDragActive
              ? "bg-brand-100 text-brand-600"
              : "bg-navy-100 text-navy-400 group-hover:bg-navy-200 group-hover:text-navy-500"
          )}
        >
          <CloudUpload className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold text-navy-700">
          {isDragActive
            ? "Drop files here..."
            : "Click or Drag PDF / Image here"}
        </p>
        <p className="mt-1.5 text-xs text-navy-400">
          Support Batch Upload &amp; Snippet Screenshots. Max 20 MB per file.
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-navy-100 bg-white px-4 py-3"
            >
              <File className="h-4 w-4 shrink-0 text-brand-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-800">
                  {f.file.name}
                </p>
                <p className="text-xs text-navy-400">
                  {formatFileSize(f.file.size)}
                </p>
              </div>
              {f.status === "uploading" ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(f.id);
                  }}
                  className="rounded p-1 text-navy-300 hover:bg-navy-50 hover:text-navy-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
