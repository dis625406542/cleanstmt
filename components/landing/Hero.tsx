"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

function BankStatementMockup() {
  return (
    <div className="relative mx-auto max-w-[480px]">
      {/* Background glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-navy-100 via-navy-50 to-brand-50 opacity-60 blur-2xl" />

      {/* Bank statement card (dark) */}
      <div className="relative rounded-2xl bg-navy-900 p-5 shadow-float ring-1 ring-navy-800">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
              FN
            </div>
            <div>
              <p className="text-[11px] font-bold text-white tracking-wide">
                FIRST NATIONAL BANK
              </p>
              <p className="text-[10px] text-navy-400">
                Account Statement &bull; Jan 2025
              </p>
            </div>
          </div>
          <div className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-mono font-medium text-navy-300">
            ****4821
          </div>
        </div>

        {/* Transaction section label */}
        <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-navy-500">
          Transaction History
        </p>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-navy-800/50 ring-1 ring-white/5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 text-left font-medium text-navy-400">Date</th>
                <th className="px-3 py-2 text-left font-medium text-navy-400">Description</th>
                <th className="px-3 py-2 text-right font-medium text-navy-400">Amount</th>
                <th className="px-3 py-2 text-right font-medium text-navy-400">Balance</th>
              </tr>
            </thead>
            <tbody className="text-white/90">
              <tr className="border-b border-white/5">
                <td className="px-3 py-2.5 font-mono">01/15/25</td>
                <td className="px-3 py-2.5">Amazon.com</td>
                <td className="px-3 py-2.5 text-right font-mono text-red-400">-$89.99</td>
                <td className="px-3 py-2.5 text-right font-mono">$12,450.00</td>
              </tr>
              <tr className="border-b border-white/5 bg-brand-500/10">
                <td className="px-3 py-2.5 font-mono text-brand-300">01/16/25</td>
                <td className="px-3 py-2.5 text-brand-300">Wire Transfer</td>
                <td className="px-3 py-2.5 text-right font-mono text-brand-300">-$5,000.00</td>
                <td className="px-3 py-2.5 text-right font-mono text-brand-300">$7,450.00</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="px-3 py-2.5 font-mono">01/17/25</td>
                <td className="px-3 py-2.5">Electric Company</td>
                <td className="px-3 py-2.5 text-right font-mono text-red-400">-$142.50</td>
                <td className="px-3 py-2.5 text-right font-mono">$7,307.50</td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-mono">01/18/25</td>
                <td className="px-3 py-2.5">Whole Foods Mkt</td>
                <td className="px-3 py-2.5 text-right font-mono text-red-400">-$67.23</td>
                <td className="px-3 py-2.5 text-right font-mono">$7,240.27</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Excel output card - overlapping bottom-right */}
      <div className="relative -mt-6 ml-auto mr-0 w-[85%] rounded-xl border border-navy-200 bg-white shadow-modal ring-1 ring-black/5">
        {/* macOS title bar */}
        <div className="flex items-center gap-2 rounded-t-xl border-b border-navy-100 bg-navy-50/80 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="text-[10px] font-medium text-navy-500">
            bank_statement_export.xlsx
          </span>
        </div>
        {/* Spreadsheet toolbar hint */}
        <div className="flex gap-4 border-b border-navy-100 px-3 py-1">
          {["File", "Home", "Insert", "Data"].map((t) => (
            <span key={t} className="text-[9px] text-navy-400">{t}</span>
          ))}
        </div>
        {/* Column headers (A, B, C, D) */}
        <div className="grid grid-cols-4 border-b border-navy-100 bg-navy-50/40">
          {["A", "B", "C", "D"].map((c) => (
            <span key={c} className="border-r border-navy-100 py-0.5 text-center text-[9px] font-medium text-navy-400 last:border-0">{c}</span>
          ))}
        </div>
        {/* Header row */}
        <div className="grid grid-cols-4 border-b border-navy-100 bg-navy-50/30">
          {["Date", "Description", "Amount", "Balance"].map((h) => (
            <span key={h} className="border-r border-navy-100 px-2 py-1.5 text-[10px] font-semibold text-navy-600 last:border-0">{h}</span>
          ))}
        </div>
        {/* Data rows */}
        <div className="grid grid-cols-4 border-b border-navy-100">
          <span className="border-r border-navy-100 px-2 py-1.5 font-mono text-[10px] text-navy-600">01/15/25</span>
          <span className="border-r border-navy-100 px-2 py-1.5 text-[10px] text-navy-700">Amazon.com</span>
          <span className="border-r border-navy-100 px-2 py-1.5 text-right font-mono text-[10px] text-red-500">-$89.99</span>
          <span className="px-2 py-1.5 text-right font-mono text-[10px] font-medium text-navy-900">$12,450.00</span>
        </div>
        <div className="grid grid-cols-4 rounded-b-xl bg-brand-50/60">
          <span className="border-r border-navy-100 px-2 py-1.5 font-mono text-[10px] text-navy-600">01/16/25</span>
          <span className="border-r border-navy-100 px-2 py-1.5 text-[10px] text-navy-700">Wire Transfer - Acm...</span>
          <span className="border-r border-navy-100 px-2 py-1.5 text-right font-mono text-[10px] text-red-500">-$5,000.00</span>
          <span className="px-2 py-1.5 text-right font-mono text-[10px] font-medium text-navy-900">$7,450.00</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-white pb-20 pt-28 lg:pt-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Audit-Ready Extraction
            </div>

            <h1 className="text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-navy-900 lg:text-[3.5rem]">
              Turn Bank Statements into{" "}
              <span className="text-brand-500">Excel</span> in Seconds.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-navy-500 lg:text-lg">
              Skip the manual data entry. Upload any bank statement and get
              structured Excel data in seconds —{" "}
              <strong className="text-navy-700">no merged cells</strong>, ready
              for QuickBooks.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/#upload-tool"
                className="group inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-800"
              >
                Convert a Statement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/app/review"
                className="inline-flex items-center rounded-lg border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition-all hover:bg-navy-50"
              >
                View Excel Sample
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                "No signup required",
                "Files wiped in 1 hr",
                "200+ bank formats",
              ].map((text) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-navy-400"
                >
                  <svg
                    className="h-3.5 w-3.5 text-brand-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right: visual mockup */}
          <div className="relative">
            <BankStatementMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
