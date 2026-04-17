"use client";

import { useCallback, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ToolPanel, { type ToolStep } from "@/components/tool/ToolPanel";

interface CollapsibleToolHeroProps {
  badgeText: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  highlights: string[];
  panelTitle: string;
  panelDescription: string;
  panelFootnote?: string;
  previewLabel?: string;
}

export default function CollapsibleToolHero({
  badgeText,
  title,
  description,
  secondaryDescription,
  highlights,
  panelTitle,
  panelDescription,
  panelFootnote,
  previewLabel = "Statement Preview Placeholder",
}: CollapsibleToolHeroProps) {
  const [expanded, setExpanded] = useState(false);

  const handleStepChange = useCallback((step: ToolStep) => {
    setExpanded(step !== "upload");
  }, []);

  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
      <div
        className={cn(
          "grid items-start transition-all duration-500 ease-in-out",
          expanded
            ? "lg:grid-cols-1"
            : "gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10"
        )}
      >
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden",
            expanded
              ? "max-h-0 opacity-0 lg:absolute lg:pointer-events-none"
              : "max-h-[1200px] opacity-100"
          )}
        >
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {badgeText}
            </div>

            <h1 className="text-[28px] font-extrabold leading-[1.2] tracking-tight text-navy-900 lg:text-[36px]">
              {title}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-navy-500">
              {description}
            </p>

            {secondaryDescription ? (
              <p className="mt-3 text-sm leading-relaxed text-navy-500">
                {secondaryDescription}
              </p>
            ) : null}

            <div className="mt-5 grid gap-2 text-sm text-navy-700">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-surface-200 bg-surface-50 p-4">
              <p className="text-sm font-semibold text-navy-900">{panelTitle}</p>
              <p className="mt-2 text-xs leading-relaxed text-navy-500">
                {panelDescription}
              </p>
              {panelFootnote ? (
                <p className="mt-2 text-xs leading-relaxed text-navy-500">
                  {panelFootnote}
                </p>
              ) : null}

              <div className="mt-4 rounded-xl border border-surface-200 bg-white p-3">
                <div className="mb-2 text-xs font-medium text-navy-500">
                  {previewLabel}
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-surface-200" />
                  <div className="h-2 w-[88%] rounded bg-surface-200" />
                  <div className="h-2 w-[93%] rounded bg-surface-200" />
                  <div className="h-2 w-[74%] rounded bg-surface-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            expanded ? "min-h-[560px]" : "min-h-[500px] lg:min-h-[540px]"
          )}
        >
          <ToolPanel onStepChange={handleStepChange} />
        </div>
      </div>
    </section>
  );
}
