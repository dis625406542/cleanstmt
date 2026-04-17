import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - CleanStmt",
  description:
    "Review the terms governing your use of CleanStmt, including acceptable use, disclaimers, and liability limits.",
};

export default function TermsPage() {
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
        <FileText className="h-8 w-8 text-brand-500" />
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      </div>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600">
          These Terms of Service govern your access to and use of CleanStmt.
        </p>
        <p className="mt-2 text-sm text-gray-500">Last updated: April 17, 2026</p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Use of Service</h2>
        <p className="mt-3 text-gray-600">
          You may use CleanStmt to process statement files for lawful business or
          personal accounting purposes. You agree not to misuse the platform,
          attempt unauthorized access, or interfere with service reliability.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Data and Processing
        </h2>
        <p className="mt-3 text-gray-600">
          CleanStmt processes uploaded files in-memory and is designed to purge
          data automatically within one hour. You are responsible for ensuring
          you have the right to process any documents you upload.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">No Warranty</h2>
        <p className="mt-3 text-gray-600">
          The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
          While we aim for high extraction accuracy, we do not guarantee that all
          outputs will be error-free or suitable for every accounting workflow
          without review.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Limitation of Liability
        </h2>
        <p className="mt-3 text-gray-600">
          To the maximum extent permitted by law, CleanStmt and its operators are
          not liable for indirect, incidental, or consequential damages resulting
          from your use of the service.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Third-Party Services and Advertising
        </h2>
        <p className="mt-3 text-gray-600">
          CleanStmt may include third-party integrations or advertisements
          (including Google AdSense). We are not responsible for the content,
          terms, or privacy practices of third-party sites or services.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Changes</h2>
        <p className="mt-3 text-gray-600">
          We may update these Terms periodically. Continued use of CleanStmt
          after changes take effect constitutes acceptance of the revised Terms.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">Contact</h2>
        <p className="mt-3 text-gray-600">
          Questions about these Terms can be sent to{" "}
          <a
            href="mailto:legal@cleanstmt.com"
            className="text-brand-600 hover:underline"
          >
            legal@cleanstmt.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
