import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - CleanStmt",
  description:
    "Learn how CleanStmt protects your financial data. Bank-grade encryption, in-memory processing, automatic deletion.",
};

export default function PrivacyPage() {
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
        <Shield className="h-8 w-8 text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600">
          At CleanStmt, we take your financial data privacy extremely seriously.
          This policy explains how we handle your data.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Data Processing
        </h2>
        <ul className="mt-4 space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              All file processing occurs <strong>entirely in memory</strong>.
              Your bank statements are never written to permanent disk storage.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Files are encrypted with <strong>256-bit SSL</strong> during
              transit between your browser and our servers.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              All data is{" "}
              <strong>automatically destroyed within 1 hour</strong> of
              processing, regardless of whether you download the results.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          No Human Review
        </h2>
        <p className="mt-3 text-gray-600">
          Your financial documents are processed exclusively by AI. No human
          employee will ever view, access, or review your bank statements. Our
          systems are designed with zero-access architecture.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          What We Don&apos;t Collect
        </h2>
        <ul className="mt-4 space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>We do not store your bank statements</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>We do not retain extracted transaction data</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>We do not sell or share any user data with third parties</span>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Contact</h2>
        <p className="mt-3 text-gray-600">
          If you have questions about our privacy practices, contact us at{" "}
          <a
            href="mailto:privacy@cleanstmt.com"
            className="text-brand-600 hover:underline"
          >
            privacy@cleanstmt.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
