import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - CleanStmt",
  description:
    "Learn about CleanStmt, our mission, and how we help accounting teams convert statements into clean spreadsheet data.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <Building2 className="h-8 w-8 text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">About CleanStmt</h1>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600">
          CleanStmt helps accountants, finance teams, and operations teams
          convert statement PDFs and scans into clean spreadsheet data.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Our Mission</h2>
        <p className="mt-3 text-gray-600">
          We built CleanStmt to remove manual spreadsheet cleanup from financial
          workflows. Our focus is simple: no merged cells, stable columns, and
          exports that are ready for reconciliation or QuickBooks import.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Who It&apos;s For</h2>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li>Bookkeepers and accounting firms</li>
          <li>Finance and operations teams</li>
          <li>Small businesses handling monthly reconciliations</li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Contact</h2>
        <p className="mt-3 text-gray-600">
          For partnership or product questions, contact{" "}
          <a
            href="mailto:support@cleanstmt.com"
            className="text-brand-600 hover:underline"
          >
            support@cleanstmt.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
