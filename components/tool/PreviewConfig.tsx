"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  RefreshCw,
  Trash2,
  Play,
  Table,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedItem } from "./ToolPanel";

interface PreviewConfigProps {
  item: UploadedItem;
  onStart: (config: ExtractConfig) => void;
  onBack: () => void;
}

export interface ExtractConfig {
  mode: "table" | "word";
  columns: string[];
}

export default function PreviewConfig({
  item,
  onStart,
  onBack,
}: PreviewConfigProps) {
  const [mode, setMode] = useState<"table" | "word">("table");
  const [columns, setColumns] = useState<string[]>([]);
  const [columnInput, setColumnInput] = useState("");

  const addColumn = useCallback(() => {
    const val = columnInput.trim();
    if (val && !columns.includes(val)) {
      setColumns((prev) => [...prev, val]);
      setColumnInput("");
    }
  }, [columnInput, columns]);

  const removeColumn = useCallback((col: string) => {
    setColumns((prev) => prev.filter((c) => c !== col));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addColumn();
      }
    },
    [addColumn]
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-surface-300 bg-surface-50 px-5 py-3">
        <h3 className="text-sm font-semibold text-navy-800">Image Preview</h3>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-navy-500 hover:bg-navy-50">
            <RefreshCw className="h-3 w-3" />
            Change
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: preview pane */}
        <div className="flex flex-1 flex-col items-center justify-center border-r border-surface-300 bg-surface-100/80 p-6">
          {item.previewUrl ? (
            <div className="relative">
              <img
                src={item.previewUrl}
                alt="Upload preview"
                className="max-h-[340px] rounded-lg border border-navy-200 object-contain shadow-card"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-navy-400">
              <FileText className="h-16 w-16" />
              <p className="text-sm font-medium">{item.name}</p>
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                PDF Ready
              </span>
            </div>
          )}
        </div>

        {/* Right: config pane */}
        <div className="flex w-72 shrink-0 flex-col bg-white p-6 xl:w-80">
          <h4 className="mb-4 text-sm font-bold text-navy-800">Config</h4>

          {/* Extraction Mode */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold text-navy-600">
              Extraction Mode
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("table")}
                style={
                  mode === "table"
                    ? { backgroundColor: "#2563EB", color: "#fff" }
                    : {}
                }
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all",
                  mode === "table"
                    ? "border-transparent shadow-sm"
                    : "border-navy-200 bg-white text-navy-500 hover:border-navy-300 hover:text-navy-700"
                )}
              >
                <Table className="h-3.5 w-3.5" />
                To Table
              </button>
              <button
                onClick={() => setMode("word")}
                style={
                  mode === "word"
                    ? { backgroundColor: "#2563EB", color: "#fff" }
                    : {}
                }
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all",
                  mode === "word"
                    ? "border-transparent shadow-sm"
                    : "border-navy-200 bg-white text-navy-500 hover:border-navy-300 hover:text-navy-700"
                )}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                To Word
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-navy-400">
              Extract data into a spreadsheet.
            </p>
          </div>

          {/* Columns to Extract */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold text-navy-600">
              Columns to Extract
            </p>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={columnInput}
                onChange={(e) => setColumnInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Date (one by one)"
                className="min-w-0 flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs text-navy-700 placeholder:text-navy-300 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200"
              />
              <button
                onClick={addColumn}
                className="shrink-0 rounded-lg border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-600 hover:bg-navy-50"
              >
                Add
              </button>
            </div>

            {/* Added columns as tags */}
            {columns.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {columns.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-700 ring-1 ring-brand-200/60"
                  >
                    {col}
                    <button
                      onClick={() => removeColumn(col)}
                      className="rounded-sm hover:text-brand-900"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-2 rounded-lg border border-navy-100 bg-navy-50/40 px-3 py-2.5">
                <p className="text-[10px] leading-relaxed text-navy-400">
                  No columns defined. AI will infer the table structure.
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto" />
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-center gap-3 border-t border-surface-300 bg-surface-50 px-5 py-3.5">
        <button
          onClick={() => onStart({ mode, columns })}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
        >
          <Play className="h-3.5 w-3.5" />
          Start
        </button>
        <button
          onClick={onBack}
          className="inline-flex items-center rounded-lg border border-navy-200 bg-white px-7 py-2.5 text-sm font-semibold text-navy-600 transition-all hover:bg-navy-50"
        >
          Back
        </button>
      </div>

      {/* Usage hint */}
      <div className="border-t border-surface-200 py-2 text-center">
        <p className="text-[10px] text-navy-400">
          Free to use. No signup required.
        </p>
      </div>
    </div>
  );
}
