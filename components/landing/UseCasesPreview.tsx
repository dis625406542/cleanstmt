import Link from "next/link";
import { useCases } from "@/lib/use-cases";

export default function UseCasesPreview() {
  return (
    <section className="border-t border-surface-200 bg-surface-50 py-14">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-400">
          High-Intent Workflows
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 lg:text-3xl">
          Conversion Use Cases That Match Buyer Intent
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-500">
          These use-case pages target reconciliation and bookkeeping queries where
          users need clean, QuickBooks-ready CSV output without merged cells.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCaseItem) => (
            <Link
              key={useCaseItem.id}
              href={`/use-cases/${useCaseItem.id}`}
              className="rounded-2xl border border-surface-200 bg-white p-5 transition-colors hover:border-brand-200 hover:bg-brand-50"
            >
              <p className="text-base font-semibold text-navy-900">
                {useCaseItem.h1}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {useCaseItem.description}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/use-cases"
          className="mt-6 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Explore all use cases
        </Link>
      </div>
    </section>
  );
}
