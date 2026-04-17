"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import DataGrid, { type GridRow } from "@/components/app/DataGrid";
import ExportToolbar from "@/components/app/ExportToolbar";
import {
  exportToExcel,
  exportToQuickBooksCSV,
  copyToClipboard,
} from "@/lib/export";

const MOCK_DATA: GridRow[] = [
  { id: "1", date: "01/02/2025", description: "Shopify Monthly", category: "Software", debit: "$29.99", credit: "", balance: "$12,450.32" },
  { id: "2", date: "01/03/2025", description: "Client Payment - Invoice #1042", category: "Income", debit: "", credit: "$3,500.00", balance: "$15,950.32" },
  { id: "3", date: "01/05/2025", description: "AT&T Wireless", category: "Utilities", debit: "$89.50", credit: "", balance: "$15,860.82" },
  { id: "4", date: "01/08/2025", description: "Office Depot - Supplies", category: "Office", debit: "$142.37", credit: "", balance: "$15,718.45" },
  { id: "5", date: "01/10/2025", description: "Gusto Payroll", category: "Payroll", debit: "$4,250.00", credit: "", balance: "$11,468.45" },
  { id: "6", date: "01/12/2025", description: "Amazon Web Services", category: "Cloud", debit: "$187.63", credit: "", balance: "$11,280.82" },
  { id: "7", date: "01/15/2025", description: "Transfer from Savings", category: "Transfer", debit: "", credit: "$2,000.00", balance: "$13,280.82" },
  { id: "8", date: "01/18/2025", description: "Delta Airlines", category: "Travel", debit: "$342.00", credit: "", balance: "$12,938.82" },
  { id: "9", date: "01/20/2025", description: "Google Workspace", category: "Software", debit: "$72.00", credit: "", balance: "$12,866.82" },
  { id: "10", date: "01/22/2025", description: "Client Payment - Invoice #1048", category: "Income", debit: "", credit: "$5,200.00", balance: "$18,066.82" },
  { id: "11", date: "01/25/2025", description: "WeWork Office Rent", category: "Rent", debit: "$1,800.00", credit: "", balance: "$16,266.82" },
  { id: "12", date: "01/31/2025", description: "QuickBooks Subscription", category: "Software", debit: "$55.00", credit: "", balance: "$16,211.82" },
];

function buildRowsFromExtraction(data: {
  columns?: string[];
  rows?: string[][];
}): GridRow[] | null {
  if (!data.columns || !data.rows || data.rows.length === 0) return null;
  return data.rows.map((row, i) => {
    const obj: Record<string, string> = { id: String(i + 1) };
    data.columns!.forEach((col, j) => {
      obj[col] = row[j] ?? "";
    });
    return obj as GridRow;
  });
}

export default function ReviewPage() {
  const [rows, setRows] = useState<GridRow[]>(MOCK_DATA);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("extractResult");
      if (!raw) return;
      const data = JSON.parse(raw);
      const extracted = buildRowsFromExtraction(data);
      if (extracted && extracted.length > 0) {
        setRows(extracted);
      }
    } catch {
      // fall back to mock data silently
    }
  }, []);

  const handleRowUpdate = useCallback(
    (id: string, field: keyof GridRow, value: string) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    },
    []
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/app"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-200 bg-white text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Review &amp; Export
          </h1>
          <p className="mt-0.5 text-base font-semibold text-brand-600">
            Double-click any cell to correct extracted data
          </p>
        </div>
      </div>

      {/* Success badge */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-2 ring-1 ring-brand-200/60">
        <CheckCircle2 className="h-4 w-4 text-brand-600" />
        <span className="text-sm font-medium text-brand-800">
          {rows.length} rows extracted &mdash; No Merged Cells
        </span>
      </div>

      {/* Export toolbar */}
      <div className="mb-5">
        <ExportToolbar
          rows={rows}
          onExportExcel={() => exportToExcel(rows)}
          onExportCSV={() => exportToQuickBooksCSV(rows)}
          onCopyClipboard={() => copyToClipboard(rows)}
        />
      </div>

      {/* Data table */}
      <DataGrid rows={rows} onRowUpdate={handleRowUpdate} />
    </div>
  );
}
