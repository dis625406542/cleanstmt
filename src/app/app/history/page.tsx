"use client";

import { Clock, FileSpreadsheet, Download, Trash2 } from "lucide-react";

const historyItems = [
  {
    id: "1",
    filename: "chase_jan_2025.pdf",
    date: "2025-01-28 14:32",
    rows: 47,
    status: "completed" as const,
  },
  {
    id: "2",
    filename: "bofa_dec_2024.pdf",
    date: "2025-01-25 09:15",
    rows: 63,
    status: "completed" as const,
  },
  {
    id: "3",
    filename: "wells_fargo_nov.pdf",
    date: "2025-01-20 16:45",
    rows: 31,
    status: "completed" as const,
  },
];

export default function HistoryPage() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Clock className="h-6 w-6 text-brand-500" />
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
      </div>

      {historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 py-20">
          <Clock className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No conversion history yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Your processed statements will appear here
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-surface-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  File
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Processed
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Rows
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-surface-100 last:border-0 hover:bg-surface-50/60"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-4 w-4 text-brand-500" />
                      <span className="font-medium text-gray-800">
                        {item.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{item.date}</td>
                  <td className="px-5 py-3.5 text-center font-mono text-gray-700">
                    {item.rows}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60">
                      Completed
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-surface-100 hover:text-brand-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
