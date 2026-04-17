"use client";

import { useState, useCallback } from "react";
import {
  ClipboardCopy,
  Download,
  ArrowLeft,
  RefreshCw,
  Check,
  FileText,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedItem, ExtractResult, DocSection, SectionGroup } from "./ToolPanel";

interface ResultViewProps {
  item: UploadedItem;
  result: ExtractResult;
  onResultChange: (result: ExtractResult) => void;
  onBack: () => void;
  onRestart: () => void;
}

function sectionItemToString(item: string | { label: string; value: string }): string {
  if (typeof item === "string") return item;
  return `${item.label}: ${item.value}`;
}

function buildSheetRows(result: ExtractResult): string[][] {
  const rows: string[][] = [];
  const colCount = result.columns.length || 4;

  result.header.forEach((h) => {
    const row = new Array(colCount).fill("");
    row[0] = h.label;
    row[1] = h.value;
    rows.push(row);
  });

  result.sections.forEach((section) => {
    if (rows.length > 0) rows.push(new Array(colCount).fill(""));

    if (section.layout === "side-by-side") {
      const titleRow = new Array(colCount).fill("");
      section.groups.forEach((g, gi) => {
        if (gi < colCount) titleRow[gi] = g.title;
      });
      rows.push(titleRow);

      const maxItems = Math.max(...section.groups.map((g) => g.items.length));
      for (let i = 0; i < maxItems; i++) {
        const dataRow = new Array(colCount).fill("");
        section.groups.forEach((g, gi) => {
          if (gi < colCount && i < g.items.length) {
            dataRow[gi] = sectionItemToString(g.items[i]);
          }
        });
        rows.push(dataRow);
      }
    } else {
      section.groups.forEach((g) => {
        const titleRow = new Array(colCount).fill("");
        titleRow[0] = g.title;
        rows.push(titleRow);
        g.items.forEach((item) => {
          const dataRow = new Array(colCount).fill("");
          if (typeof item === "string") {
            dataRow[0] = item;
          } else {
            dataRow[0] = item.label;
            dataRow[1] = item.value;
          }
          rows.push(dataRow);
        });
      });
    }
  });

  if (rows.length > 0) rows.push(new Array(colCount).fill(""));
  rows.push([...result.columns]);
  result.rows.forEach((row) => {
    const padded = new Array(colCount).fill("");
    row.forEach((cell, i) => {
      if (i < colCount) padded[i] = cell ?? "";
    });
    rows.push(padded);
  });

  if (result.summary.length > 0) {
    rows.push(new Array(colCount).fill(""));
    const labelCol = Math.max(colCount - 2, 0);
    const valueCol = colCount - 1;
    result.summary.forEach((s) => {
      const row = new Array(colCount).fill("");
      row[labelCol] = s.label;
      row[valueCol] = s.value;
      rows.push(row);
    });
  }

  return rows;
}

type RowType = "header-field" | "section-title" | "section-data" | "blank" | "col-header" | "data" | "summary";

function buildRowTypes(result: ExtractResult): RowType[] {
  const types: RowType[] = [];
  const colCount = result.columns.length || 4;

  result.header.forEach(() => types.push("header-field"));

  result.sections.forEach((section) => {
    if (types.length > 0) types.push("blank");
    if (section.layout === "side-by-side") {
      types.push("section-title");
      const maxItems = Math.max(...section.groups.map((g) => g.items.length));
      for (let i = 0; i < maxItems; i++) types.push("section-data");
    } else {
      section.groups.forEach((g) => {
        types.push("section-title");
        g.items.forEach(() => types.push("section-data"));
      });
    }
  });

  if (types.length > 0) types.push("blank");
  types.push("col-header");
  result.rows.forEach(() => types.push("data"));

  if (result.summary.length > 0) {
    types.push("blank");
    result.summary.forEach(() => types.push("summary"));
  }

  return types;
}

function resultToTSV(result: ExtractResult): string {
  return buildSheetRows(result)
    .map((row) => row.join("\t"))
    .join("\n");
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function buildExportBaseName(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = pad2(now.getMonth() + 1);
  const dd = pad2(now.getDate());
  const HH = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  return `CleanStmt_${yyyy}${MM}${dd}${HH}${mm}${ss}`;
}

function exportCSV(result: ExtractResult) {
  const csvRows = buildSheetRows(result).map((row) =>
    row.map((cell) => `"${(cell ?? "").replace(/"/g, '""')}"`).join(",")
  );
  downloadBlob(
    csvRows.join("\n"),
    `${buildExportBaseName()}.csv`,
    "text/csv;charset=utf-8"
  );
}

function parseMoneyValue(str: string): { isNumber: boolean; value: number } {
  if (!str || typeof str !== "string") return { isNumber: false, value: 0 };
  const s = str.trim();
  if (!s.includes("$")) return { isNumber: false, value: 0 };
  // ($1,234.56) or (-$1,234.56)
  const negParen = /^\(?\$?([\d,]+\.?\d*)\)?$/.exec(s);
  if (s.startsWith("(") && s.endsWith(")") && s.includes("$")) {
    const inner = s.slice(1, -1).replace("$", "").replace(/,/g, "");
    const num = parseFloat(inner);
    if (!isNaN(num)) return { isNumber: true, value: -num };
  }
  // -$1,234.56
  if (s.startsWith("-$")) {
    const num = parseFloat(s.slice(2).replace(/,/g, ""));
    if (!isNaN(num)) return { isNumber: true, value: -num };
  }
  // $1,234.56
  if (s.startsWith("$")) {
    const num = parseFloat(s.slice(1).replace(/,/g, ""));
    if (!isNaN(num)) return { isNumber: true, value: num };
  }
  return { isNumber: false, value: 0 };
}

function exportExcel(result: ExtractResult) {
  import("xlsx-js-style").then((XLSX) => {
    const wb = XLSX.utils.book_new();
    const sheetData = buildSheetRows(result);
    const rowTypes = buildRowTypes(result);
    // dateNF + cellDates: false prevents auto date parsing
    const ws = XLSX.utils.aoa_to_sheet(sheetData, { dateNF: "@", cellDates: false });

    const colCount = result.columns.length || 4;
    const colWidths: number[] = [];
    for (let c = 0; c < colCount; c++) {
      let maxW = 10;
      sheetData.forEach((row) => {
        const len = (row[c] ?? "").toString().length;
        if (len > maxW) maxW = len;
      });
      colWidths.push(Math.min(maxW + 2, 40));
    }
    ws["!cols"] = colWidths.map((w) => ({ wch: w }));

    const BLUE_FILL = { fgColor: { rgb: "1B2A4A" } };
    const WHITE_FONT = { color: { rgb: "FFFFFF" }, bold: true, sz: 11 };
    const DEFAULT_FONT = { sz: 11 };
    const MONEY_FMT = "$#,##0.00";

    rowTypes.forEach((type, rowIdx) => {
      for (let c = 0; c < colCount; c++) {
        const addr = XLSX.utils.encode_cell({ r: rowIdx, c });
        const originalVal = sheetData[rowIdx]?.[c] ?? "";

        if (!ws[addr]) ws[addr] = { v: "", t: "s" };

        // Force text for header, section title/data, blank, and column header rows
        if (type === "header-field" || type === "section-data" || type === "blank") {
          ws[addr] = { v: String(originalVal), t: "s", s: { font: DEFAULT_FONT } };
        }

        if (type === "section-title" || type === "col-header") {
          ws[addr] = {
            v: String(originalVal),
            t: "s",
            s: {
              fill: BLUE_FILL,
              font: WHITE_FONT,
              alignment: { horizontal: "left", vertical: "center" },
            },
          };
        }

        if (type === "data") {
          const parsed = parseMoneyValue(originalVal);
          if (parsed.isNumber) {
            ws[addr] = {
              v: parsed.value,
              t: "n",
              s: { font: DEFAULT_FONT, numFmt: MONEY_FMT, alignment: { horizontal: "right" } },
            };
          } else {
            ws[addr] = { v: String(originalVal), t: "s", s: { font: DEFAULT_FONT } };
          }
        }

        if (type === "summary") {
          const labelCol = Math.max(colCount - 2, 0);
          const valueCol = colCount - 1;
          if (c === valueCol) {
            const parsed = parseMoneyValue(originalVal);
            if (parsed.isNumber) {
              ws[addr] = {
                v: parsed.value,
                t: "n",
                s: {
                  font: { bold: true, sz: 11 },
                  numFmt: MONEY_FMT,
                  alignment: { horizontal: "right" },
                  border: {
                    bottom: { style: "thin", color: { rgb: "1B2A4A" } },
                  },
                },
              };
            } else {
              ws[addr] = {
                v: String(originalVal),
                t: "s",
                s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right" } },
              };
            }
          } else if (c === labelCol) {
            ws[addr] = {
              v: String(originalVal),
              t: "s",
              s: { font: { bold: true, sz: 11 }, alignment: { horizontal: "right", vertical: "center" } },
            };
          } else {
            ws[addr] = { v: String(originalVal), t: "s" };
          }
        }
      }
    });

    XLSX.utils.book_append_sheet(wb, ws, "Extract");
    XLSX.writeFile(wb, `${buildExportBaseName()}.xlsx`);
  });
}

async function exportWord(result: ExtractResult) {
  const docx = await import("docx");
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType,
    ShadingType,
    TableLayoutType,
    VerticalAlign,
  } = docx;

  const BORDER_COLOR = "D4D4D4";
  const HEADER_BG = "1B2A4A";
  const LABEL_BG = "F8FAFC";
  const DEFAULT_FONT_COLOR = "1E293B";

  const withBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
  };

  const noBorder = {
    top: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NIL, size: 0, color: "FFFFFF" },
  };

  const paragraph = (
    text: string,
    opts?: { bold?: boolean; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType] }
  ) =>
    new Paragraph({
      alignment: opts?.align,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({
          text: text || "",
          bold: opts?.bold,
          color: opts?.color ?? DEFAULT_FONT_COLOR,
          size: 22,
        }),
      ],
    });

  const sheetData = buildSheetRows(result);
  const rowTypes = buildRowTypes(result);
  const colCount = result.columns.length || 4;
  const summaryLabelCol = Math.max(colCount - 2, 0);
  const summaryValueCol = colCount - 1;

  const colWeights = new Array(colCount).fill(10);
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < sheetData.length; r++) {
      const len = (sheetData[r]?.[c] ?? "").toString().length;
      colWeights[c] = Math.max(colWeights[c], Math.min(40, len + 2));
    }
  }
  const totalWeight = colWeights.reduce((a, b) => a + b, 0);
  const colPercents = colWeights.map((w) => Math.max(8, Math.round((w / totalWeight) * 100)));

  const tableRows = sheetData.map((row, rowIdx) => {
    const type = rowTypes[rowIdx] ?? "data";
    const nonEmptyCols = row
      .map((cell, idx) => ({ idx, hasText: !!String(cell ?? "").trim() }))
      .filter((x) => x.hasText)
      .map((x) => x.idx);

    const canMergeSectionTitle =
      type === "section-title" && nonEmptyCols.length === 1 && nonEmptyCols[0] === 0;

    if (canMergeSectionTitle) {
      return new TableRow({
        children: [
          new TableCell({
            columnSpan: colCount,
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: withBorder,
            shading: { fill: HEADER_BG, color: "auto", type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 90, bottom: 90, left: 80, right: 80 },
            children: [paragraph(row[0] ?? "", { bold: true, color: "FFFFFF" })],
          }),
        ],
      });
    }

    return new TableRow({
      children: row.map((raw, c) => {
        const text = String(raw ?? "");
        const isBlankRow = type === "blank";
        const isSummaryLeadingEmpty = type === "summary" && c < summaryLabelCol && !text.trim();
        const hasMoney = parseMoneyValue(text).isNumber;
        const isDarkRow = type === "section-title" || type === "col-header";
        const shouldRightAlign =
          (type === "summary" && (c === summaryLabelCol || c === summaryValueCol)) ||
          ((type === "data" || type === "summary") && hasMoney);

        const isBold =
          type === "col-header" ||
          type === "section-title" ||
          (type === "header-field" && c === 0) ||
          (type === "summary" && (c === summaryLabelCol || c === summaryValueCol));

        const shading =
          isDarkRow
            ? { fill: HEADER_BG, color: "auto", type: ShadingType.CLEAR }
            : type === "header-field" && c === 0
              ? { fill: LABEL_BG, color: "auto", type: ShadingType.CLEAR }
              : undefined;

        return new TableCell({
          width: { size: colPercents[c], type: WidthType.PERCENTAGE },
          borders: isBlankRow || isSummaryLeadingEmpty ? noBorder : withBorder,
          shading,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 70, bottom: 70, left: 70, right: 70 },
          children: [
            paragraph(text, {
              bold: isBold,
              color: isDarkRow ? "FFFFFF" : DEFAULT_FONT_COLOR,
              align: shouldRightAlign ? AlignmentType.RIGHT : AlignmentType.LEFT,
            }),
          ],
        });
      }),
    });
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${buildExportBaseName()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultView({
  item,
  result,
  onResultChange,
  onBack,
  onRestart,
}: ResultViewProps) {
  const [copied, setCopied] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(resultToTSV(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const startEdit = useCallback((rowIdx: number, colIdx: number, val: string) => {
    setEditingCell({ row: rowIdx, col: colIdx });
    setEditValue(val);
  }, []);

  const commitEdit = useCallback(() => {
    if (editingCell) {
      const newRows = result.rows.map((r) => [...r]);
      newRows[editingCell.row][editingCell.col] = editValue;
      onResultChange({ ...result, rows: newRows });
      setEditingCell(null);
    }
  }, [editingCell, editValue, result, onResultChange]);

  const colCount = result.columns.length || 4;

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-surface-300 bg-surface-50 px-5 py-3">
        <h3 className="text-sm font-semibold text-navy-800">
          Result
          <span className="ml-2 text-[11px] font-normal text-navy-400">
            {result.rows.length} rows &middot; {result.columns.length} columns
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              copied
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                : "bg-brand-600 text-white hover:bg-brand-700"
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <ClipboardCopy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => exportExcel(result)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800"
          >
            <Download className="h-3 w-3" />
            Excel
          </button>
          <button
            onClick={() => exportCSV(result)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <FileSpreadsheet className="h-3 w-3" />
            CSV
          </button>
          <button
            onClick={() => exportWord(result)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <FileText className="h-3 w-3" />
            Word
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: original image */}
        <div
          className={cn(
            "relative shrink-0 border-r border-surface-200 bg-surface-100/60 transition-all duration-300",
            previewCollapsed ? "w-0 overflow-hidden border-0" : "w-2/5"
          )}
        >
          <div className="flex h-full flex-col items-center justify-center p-4">
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt="Original document"
                className="max-h-full rounded-lg border border-navy-200 object-contain shadow-card"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-navy-400">
                <FileText className="h-12 w-12" />
                <p className="text-xs font-medium">{item.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setPreviewCollapsed(!previewCollapsed)}
          className="flex w-5 shrink-0 items-center justify-center border-r border-surface-200 bg-surface-100/60 text-navy-400 hover:bg-navy-100 hover:text-navy-600"
        >
          {previewCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Right: extracted data */}
        <div className="flex-1 overflow-auto">
          {/* Header fields */}
          {result.header.length > 0 && (
            <div className="border-b border-navy-100 bg-navy-50/40 px-4 py-3">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {result.header.map((h, i) => (
                  <div key={i} className="flex gap-2 text-[12px]">
                    <span className="font-semibold text-navy-500">{h.label}:</span>
                    <span className="text-navy-800">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sections */}
          {result.sections.map((section, si) => (
            <div key={si} className="border-b border-navy-100 px-4 py-3">
              {section.layout === "side-by-side" ? (
                <div className="flex gap-8">
                  {section.groups.map((g, gi) => (
                    <div key={gi} className="min-w-0 flex-1">
                      <h4 className="mb-1.5 rounded bg-[#1B2A4A] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        {g.title}
                      </h4>
                      <div className="space-y-0.5">
                        {g.items.map((item, ii) => (
                          <div key={ii} className="text-[12px] text-navy-700">
                            {sectionItemToString(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                section.groups.map((g, gi) => (
                  <div key={gi} className={gi > 0 ? "mt-3" : ""}>
                    <h4 className="mb-1.5 rounded bg-[#1B2A4A] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      {g.title}
                    </h4>
                    <div className="space-y-0.5">
                      {g.items.map((item, ii) => (
                        <div key={ii} className="flex gap-2 text-[12px]">
                          {typeof item === "string" ? (
                            <span className="text-navy-700">{item}</span>
                          ) : (
                            <>
                              <span className="shrink-0 font-semibold text-navy-500">{item.label}:</span>
                              <span className="text-navy-800">{item.value}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}

          {/* Data table */}
          <table className="w-full border-collapse text-[12px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#1B2A4A]">
                <th className="w-[36px] border-b-2 border-r border-navy-600 px-2 py-2.5 text-center text-[10px] font-semibold text-white">
                  #
                </th>
                {result.columns.map((col, i) => (
                  <th
                    key={i}
                    className="border-b-2 border-r border-navy-600 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-white last:border-r-0"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-b border-navy-200 transition-colors hover:bg-brand-50/40",
                    rowIdx % 2 === 1 ? "bg-navy-50/50" : "bg-white"
                  )}
                >
                  <td className="border-r border-navy-200 px-2 py-2 text-center font-mono text-[10px] text-navy-400">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, colIdx) => {
                    const isEditing =
                      editingCell?.row === rowIdx && editingCell.col === colIdx;
                    return (
                      <td
                        key={colIdx}
                        className="border-r border-navy-200 px-3 py-2 text-navy-700 last:border-r-0"
                        onDoubleClick={() => startEdit(rowIdx, colIdx, cell ?? "")}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            autoFocus
                            className="w-full rounded border border-brand-400 bg-brand-50/30 px-1.5 py-0.5 text-[12px] outline-none ring-1 ring-brand-200"
                          />
                        ) : (
                          cell || <span className="text-navy-200">&mdash;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary section */}
          {result.summary.length > 0 && (
            <div className="border-t border-navy-200 bg-navy-50/40 px-4 py-3">
              <div className="space-y-1">
                {result.summary.map((s, i) => (
                  <div key={i} className="flex items-center justify-end gap-6 text-[12px]">
                    <span className="font-medium text-navy-600">{s.label}</span>
                    <span className="w-28 text-right font-mono font-semibold text-navy-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-surface-300 bg-surface-50 px-5 py-2.5">
        <p className="text-xs font-semibold text-brand-600">
          ✏️ Double-click any cell to edit
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-4 py-1.5 text-xs font-semibold text-navy-600 hover:bg-navy-50"
          >
            <RefreshCw className="h-3 w-3" />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
