import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  banks,
  bankSegmentLabels,
  bankSegmentOrder,
  getSegmentLabel,
} from "@/lib/banks";

export const metadata: Metadata = {
  title: "Bank Statement Converters by Bank | CleanStmt",
  description:
    "Browse bank-specific statement converters for clean Excel and QuickBooks-ready CSV exports with no merged cells.",
  alternates: {
    canonical: "https://cleanstmt.com/convert",
  },
  openGraph: {
    title: "Bank Statement Converters by Bank | CleanStmt",
    description:
      "Find your bank and convert statement PDFs to accounting-ready Excel or CSV in seconds.",
    url: "https://cleanstmt.com/convert",
    siteName: "CleanStmt",
    type: "website",
  },
};

export default function ConvertIndexPage() {
  const groupedBanks = bankSegmentOrder.map((segment) => ({
    segment,
    label: bankSegmentLabels[segment],
    items: banks.filter((bank) => bank.segment === segment),
  }));

  return (
    <>
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <p className="inline-flex items-center rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
            Bank Converter Library
          </p>
          <h1 className="mt-4 text-[30px] font-extrabold leading-[1.2] tracking-tight text-navy-900 lg:text-[40px]">
            Find Your Bank Statement Converter
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-navy-500">
            Choose your bank to access a dedicated conversion page optimized for
            no merged cells, QuickBooks-ready CSV export, and faster bank
            reconciliation.
          </p>
          <div className="mt-5 max-w-4xl rounded-2xl border border-surface-200 bg-white p-5">
            <h2 className="text-base font-semibold text-navy-900">
              How to choose the right bank statement converter
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">
              If you are evaluating a statement converter, start with your exact
              bank template instead of using a generic PDF-to-Excel tool. Bank
              layouts differ in date formatting, section headers, fee summaries,
              and wrapped memo text. Those differences often cause merged cells,
              split rows, and import errors in bookkeeping software. CleanStmt
              provides bank-specific pages so accountants and operations teams can
              pick the converter that matches their statement structure, then
              export clean Excel or QuickBooks-ready CSV with less manual
              cleanup. Use the grouped library below to find your bank, run a
              sample extraction, and move straight into reconciliation workflows.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {groupedBanks.map((group) => (
              <a
                key={group.segment}
                href={`#${group.segment}`}
                className="rounded-full border border-surface-300 bg-white px-3 py-1.5 text-xs font-medium text-navy-600 hover:border-brand-200 hover:text-brand-700"
              >
                {group.label}
              </a>
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {groupedBanks.map((group) => (
              <section key={group.segment} id={group.segment}>
                <h2 className="text-lg font-bold tracking-tight text-navy-900">
                  {group.label}
                </h2>
                <p className="mt-1 text-xs text-navy-500">
                  Pages tailored for {getSegmentLabel(group.segment).toLowerCase()} workflows.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((bank) => (
                    <Link
                      key={bank.id}
                      href={`/convert/${bank.id}`}
                      className="rounded-xl border border-surface-200 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-50"
                    >
                      <p className="text-sm font-semibold text-navy-900">
                        {bank.shortName}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-navy-500">
                        {bank.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
