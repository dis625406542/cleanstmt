"use client";

import { FileSpreadsheet, FileDown, ClipboardCopy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { GridRow } from "./DataGrid";

interface ExportToolbarProps {
  rows: GridRow[];
  onExportExcel: () => void;
  onExportCSV: () => void;
  onCopyClipboard: () => void;
}

export default function ExportToolbar({
  rows,
  onExportExcel,
  onExportCSV,
  onCopyClipboard,
}: ExportToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={onExportExcel}
        disabled={rows.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-navy-800 disabled:opacity-40"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export to Excel
      </button>

      <button
        onClick={onExportCSV}
        disabled={rows.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-40"
      >
        <FileDown className="h-4 w-4" />
        QuickBooks CSV
      </button>

      <button
        onClick={handleCopy}
        disabled={rows.length === 0}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-40",
          copied
            ? "border-brand-200 bg-brand-50 text-brand-700"
            : "border-navy-200 bg-white text-navy-700 hover:bg-navy-50"
        )}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <ClipboardCopy className="h-4 w-4" />
        )}
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
}
