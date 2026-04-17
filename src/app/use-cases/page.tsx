import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useCases } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "Statement Conversion Use Cases | CleanStmt",
  description:
    "Explore high-intent statement conversion workflows including bank reconciliation and QuickBooks CSV imports.",
  alternates: {
    canonical: "https://cleanstmt.com/use-cases",
  },
};

export default function UseCasesIndexPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <p className="inline-flex items-center rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
            Use Case Library
          </p>
          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.2] tracking-tight text-navy-900 lg:text-[40px]">
            Conversion Workflows for Bookkeeping Teams
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-navy-500">
            Pick a workflow and use CleanStmt to convert PDFs, statements, and
            scans into structured accounting data with no merged cells.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
