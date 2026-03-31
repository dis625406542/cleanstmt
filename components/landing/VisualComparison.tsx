"use client";

import { X, Check } from "lucide-react";

const messyData = [
  ["01/15", "AMAZON.COM AMZN.COM/BI", "", "$-42.99", ""],
  ["", "LLWA WA", "Debit", "", "$1,247.01"],
  ["01/15  UBER *EATS", "", "", "$-18.50 $-18.50", ""],
  ["01/16 TRANSFER", "Savings → Checking merged", "$500.00", "", ""],
];

const cleanData = [
  { date: "01/15/2025", desc: "Amazon.com", debit: "$42.99", credit: "", balance: "$1,247.01" },
  { date: "01/15/2025", desc: "Uber Eats", debit: "$18.50", credit: "", balance: "$1,228.51" },
  { date: "01/16/2025", desc: "Transfer from Savings", debit: "", credit: "$500.00", balance: "$1,728.51" },
];

export default function VisualComparison() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">
            From Chaos to Clean — In Seconds
          </h2>
          <p className="mt-3 text-navy-400">
            See the difference AI-powered extraction makes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-red-200/60 bg-red-50/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                <X className="h-3 w-3 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-red-700">
                Generic PDF Converter
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-red-200/60 bg-white">
              <table className="w-full text-xs">
                <tbody>
                  {messyData.map((row, i) => (
                    <tr key={i} className="border-b border-red-100/60 last:border-0">
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className={`px-3 py-2.5 ${
                            cell === "" ? "bg-red-50/40" : ""
                          } ${
                            cell.includes("merged")
                              ? "text-red-400 line-through"
                              : "text-navy-600"
                          }`}
                        >
                          {cell || <span className="text-red-200">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-red-500">
              Merged cells, broken rows, unusable in QuickBooks
            </p>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-brand-200/60 bg-brand-50/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100">
                <Check className="h-3 w-3 text-brand-600" />
              </div>
              <span className="text-sm font-semibold text-brand-800">
                CleanStmt Output
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-brand-200/60 bg-white">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-brand-100 bg-brand-50/60">
                    <th className="px-3 py-2 text-left font-semibold text-brand-700">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-brand-700">Description</th>
                    <th className="px-3 py-2 text-right font-semibold text-brand-700">Debit</th>
                    <th className="px-3 py-2 text-right font-semibold text-brand-700">Credit</th>
                    <th className="px-3 py-2 text-right font-semibold text-brand-700">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanData.map((row, i) => (
                    <tr key={i} className="border-b border-brand-50 last:border-0">
                      <td className="px-3 py-2.5 font-mono text-navy-600">{row.date}</td>
                      <td className="px-3 py-2.5 text-navy-700">{row.desc}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-red-500">{row.debit}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-brand-600">{row.credit}</td>
                      <td className="px-3 py-2.5 text-right font-mono font-medium text-navy-900">{row.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] text-brand-600">
              Every row independent. Ready for QuickBooks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
