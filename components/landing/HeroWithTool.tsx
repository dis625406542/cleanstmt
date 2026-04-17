"use client";

import { useState, useCallback } from "react";
import ToolPanel, { type ToolStep } from "@/components/tool/ToolPanel";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const highlights = [
  "Extract dates, descriptions, amounts & balances automatically",
  "Supports 1000+ bank statement formats worldwide",
  "Clean Excel output — zero merged cells, QuickBooks ready",
];

export default function HeroWithTool() {
  const [expanded, setExpanded] = useState(false);

  const handleStepChange = useCallback((step: ToolStep) => {
    setExpanded(step !== "upload");
  }, []);

  return (
    <section id="upload-tool" className="pb-16 pt-24 lg:pt-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
        <div
          className={cn(
            "grid items-start transition-all duration-500 ease-in-out",
            expanded
              ? "lg:grid-cols-1"
              : "gap-8 lg:grid-cols-[300px_1fr] lg:gap-10 xl:grid-cols-[340px_1fr]"
          )}
        >
          {/* Left: marketing copy */}
          <div
            className={cn(
              "transition-all duration-500 ease-in-out overflow-hidden",
              expanded
                ? "max-h-0 opacity-0 lg:absolute lg:pointer-events-none"
                : "max-h-[800px] opacity-100"
            )}
          >
            <div className="lg:sticky lg:top-24">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Audit-Ready Extraction
              </div>

              <h1 className="text-[26px] font-extrabold leading-[1.2] tracking-tight text-navy-900 lg:text-[32px]">
                Convert{" "}
                <span className="text-brand-500">Bank Statements</span> to
                Excel in Seconds
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-navy-500">
                Automatically extract transactions from{" "}
                <strong className="text-navy-700">
                  PDF statements, scans, or screenshots
                </strong>{" "}
                into perfectly structured Excel files. No manual data entry.
              </p>

              <ul className="mt-5 space-y-2">
                {highlights.map((text) => (
                  <li key={text} className="flex gap-2">
                    <div className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-50">
                      <Check className="h-3 w-3 text-brand-600" />
                    </div>
                    <span className="text-[13px] leading-snug text-navy-600">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {["No signup", "Free to try", "Files wiped in 1hr"].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-navy-400"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right: tool panel */}
          <div
            className={cn(
              "transition-all duration-500 ease-in-out",
              expanded
                ? "min-h-[560px]"
                : "min-h-[500px] lg:min-h-[540px]"
            )}
          >
            <ToolPanel onStepChange={handleStepChange} />
          </div>
        </div>
      </div>
    </section>
  );
}
