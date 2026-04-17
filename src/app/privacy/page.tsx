import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - CleanStmt",
  description:
    "Learn how CleanStmt processes statement files, manages cookies, and handles third-party advertising disclosures.",
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
          At CleanStmt, we take financial data privacy seriously. This Privacy
          Policy explains what information we process, how we use it, and how we
          handle third-party services including advertising providers.
        </p>
        <p className="mt-2 text-sm text-gray-500">Last updated: April 17, 2026</p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Statement File Processing
        </h2>
        <ul className="mt-4 space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              All file processing occurs <strong>entirely in memory</strong>.
              Uploaded statement files are not written to permanent storage as
              part of normal processing.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Files are encrypted in transit over HTTPS between your browser and
              our servers.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              All data is{" "}
              <strong>automatically destroyed within 1 hour</strong> of
              processing, regardless of whether you download the exported file.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          What We Collect
        </h2>
        <ul className="mt-4 space-y-3 text-gray-600">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Temporary processing data required to extract and format your
              table output.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Basic technical diagnostics such as browser type, request timing,
              and error logs for reliability and abuse prevention.
            </span>
          </li>
        </ul>

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
            <span>
              We do not keep extracted transaction rows after the retention
              window used for processing and delivery.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              We do not sell uploaded financial document content to third
              parties.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Cookies and Analytics
        </h2>
        <p className="mt-3 text-gray-600">
          We may use cookies or similar technologies to improve site performance,
          measure traffic, and understand feature usage. You can control cookie
          behavior from your browser settings.
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Third-Party Advertising (Google AdSense)
        </h2>
        <p className="mt-3 text-gray-600">
          We may display third-party advertisements, including Google AdSense.
          These providers may use cookies to show ads based on your visits to
          this and other websites. You can learn more about Google advertising
          controls at{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            adssettings.google.com
          </a>
          .
        </p>

        <h2 className="mt-10 text-xl font-bold text-gray-900">
          Your Rights and Choices
        </h2>
        <p className="mt-3 text-gray-600">
          Depending on your jurisdiction, you may have rights to request access,
          correction, or deletion of personal information we hold. To submit a
          request, contact us using the email below.
        </p>

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
