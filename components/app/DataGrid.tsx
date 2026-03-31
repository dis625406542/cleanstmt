"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface GridRow {
  id: string;
  date: string;
  description: string;
  category: string;
  debit: string;
  credit: string;
  balance: string;
}

interface DataGridProps {
  rows: GridRow[];
  onRowUpdate: (id: string, field: keyof GridRow, value: string) => void;
}

const columns: {
  key: keyof GridRow;
  label: string;
  align: "left" | "right";
  width: string;
}[] = [
  { key: "date", label: "Date", align: "left", width: "w-[100px]" },
  { key: "description", label: "Description", align: "left", width: "min-w-[180px]" },
  { key: "category", label: "Category", align: "left", width: "w-[120px]" },
  { key: "debit", label: "Debit", align: "right", width: "w-[100px]" },
  { key: "credit", label: "Credit", align: "right", width: "w-[100px]" },
  { key: "balance", label: "Balance", align: "right", width: "w-[110px]" },
];

export default function DataGrid({ rows, onRowUpdate }: DataGridProps) {
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    field: keyof GridRow;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = useCallback(
    (rowId: string, field: keyof GridRow, currentValue: string) => {
      setEditingCell({ rowId, field });
      setEditValue(currentValue);
    },
    []
  );

  const commitEdit = useCallback(() => {
    if (editingCell) {
      onRowUpdate(editingCell.rowId, editingCell.field, editValue);
      setEditingCell(null);
    }
  }, [editingCell, editValue, onRowUpdate]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-navy-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50">
              <th className="w-[44px] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-navy-400",
                    col.width,
                    col.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-navy-50 transition-colors last:border-0 hover:bg-navy-50/50",
                  idx % 2 === 1 && "bg-navy-50/30"
                )}
              >
                <td className="px-3 py-2.5 font-mono text-[11px] text-navy-300">
                  {idx + 1}
                </td>
                {columns.map((col) => {
                  const isEditing =
                    editingCell?.rowId === row.id &&
                    editingCell.field === col.key;
                  const cellValue = row[col.key];

                  return (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 py-2.5",
                        col.align === "right" ? "text-right" : "text-left",
                        col.key === "debit" && cellValue
                          ? "font-mono text-red-500"
                          : col.key === "credit" && cellValue
                          ? "font-mono text-brand-600"
                          : col.key === "balance"
                          ? "font-mono font-medium text-navy-900"
                          : col.key === "date"
                          ? "font-mono text-navy-600"
                          : "text-navy-700"
                      )}
                      onDoubleClick={() =>
                        startEdit(row.id, col.key, cellValue)
                      }
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className={cn(
                            "w-full rounded border border-brand-400 bg-brand-50/40 px-2 py-1 text-sm outline-none ring-2 ring-brand-200/50",
                            col.align === "right" ? "text-right" : "text-left"
                          )}
                        />
                      ) : (
                        cellValue || (
                          <span className="text-navy-200">&mdash;</span>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-navy-100 bg-navy-50 px-4 py-2.5">
        <p className="text-[11px] font-medium text-navy-500">
          {rows.length} rows &middot; No merged cells
        </p>
        <p className="text-[11px] text-navy-400">Double-click to edit</p>
      </div>
    </div>
  );
}
