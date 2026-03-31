"use client";

import { useEffect, useState } from "react";
import { Loader2, ScanLine, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Loader2, label: "Uploading file...", spin: true },
  { icon: ScanLine, label: "AI reading table structure...", spin: false },
  { icon: Sparkles, label: "Cleaning data & removing merged cells...", spin: false },
  { icon: CheckCircle2, label: "Done! Preparing results...", spin: false },
];

export default function ProcessingView() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 800),
      setTimeout(() => setActiveStep(2), 1800),
      setTimeout(() => setActiveStep(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-10">
      <div className="mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </div>

      <h3 className="mb-6 text-lg font-semibold text-navy-900">
        Extracting Your Data...
      </h3>

      <div className="w-full max-w-xs space-y-3">
        {steps.map((s, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all ${
                isActive
                  ? "bg-brand-50 ring-1 ring-brand-200"
                  : isDone
                  ? "opacity-60"
                  : "opacity-30"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-600" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-navy-200" />
              )}
              <span
                className={`text-sm ${
                  isActive
                    ? "font-medium text-brand-800"
                    : isDone
                    ? "text-navy-600 line-through"
                    : "text-navy-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
