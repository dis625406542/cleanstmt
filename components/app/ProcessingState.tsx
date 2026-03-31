"use client";

import { Loader2, ScanLine, CheckCircle2 } from "lucide-react";

type ProcessingStep = "uploading" | "extracting" | "cleaning" | "done";

interface ProcessingStateProps {
  currentStep: ProcessingStep;
}

const steps: { key: ProcessingStep; label: string; desc: string }[] = [
  { key: "uploading", label: "Uploading", desc: "Sending file securely..." },
  { key: "extracting", label: "AI Extracting", desc: "Reading table structures..." },
  { key: "cleaning", label: "Cleaning Data", desc: "Removing merged cells & fixing rows..." },
  { key: "done", label: "Complete", desc: "Your clean data is ready!" },
];

export default function ProcessingState({ currentStep }: ProcessingStateProps) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-8">
      <div className="mb-8 text-center">
        {currentStep === "done" ? (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentIdx]?.label}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {steps[currentIdx]?.desc}
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i < currentIdx
                      ? "bg-emerald-500 text-white"
                      : i === currentIdx
                      ? "bg-brand-500 text-white"
                      : "bg-surface-200 text-gray-400"
                  }`}
                >
                  {i < currentIdx ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="mt-2 text-[10px] font-medium text-gray-500">
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-12 rounded sm:w-16 ${
                    i < currentIdx ? "bg-emerald-500" : "bg-surface-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
