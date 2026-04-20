import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CollapsibleToolHero from "@/components/landing/CollapsibleToolHero";
import {
  type BankConfig,
  getAllBankIds,
  getBankById,
  getRelatedBanks,
  getSegmentLabel,
} from "@/lib/banks";
import { useCases } from "@/lib/use-cases";
import { absoluteUrl } from "@/lib/site-url";

interface BankPageProps {
  params: {
    bank: string;
  };
}

function getFaqItems(bank: BankConfig) {
  const [painPointA, painPointB] = bank.commonPainPoints;
  return [
    {
      question: `Can I convert ${bank.shortName} statements with no merged cells?`,
      answer:
        "Yes. CleanStmt removes merged-cell formatting and exports transactions in clean row-by-row structure for analysis and bookkeeping.",
    },
    {
      question: `Is this ${bank.shortName} statement converter QuickBooks ready?`,
      answer:
        "Yes. You can export CSV output with consistent date and amount columns designed for QuickBooks import workflows.",
    },
    {
      question: `Can I use screenshot or scanned ${bank.shortName} statements?`,
      answer:
        "Yes. CleanStmt supports statement PDFs, scans, and screenshots so teams can standardize data from different source formats.",
    },
    {
      question: `How fast can I export ${bank.shortName} transactions to Excel?`,
      answer:
        "Most files are processed in seconds. Upload, review, and export clean Excel or CSV output without manual cleanup.",
    },
    {
      question: `How does CleanStmt handle ${bank.shortName} layout edge cases?`,
      answer: painPointA
        ? `It is built to address issues like: ${painPointA} so you keep reliable row and column structure.`
        : "CleanStmt normalizes non-standard statement layouts into stable transaction tables.",
    },
    {
      question: `Can I use ${bank.shortName} statement output for bank reconciliation?`,
      answer:
        "Yes. CleanStmt keeps transaction rows structured so accounting teams can quickly match entries during month-end reconciliation.",
    },
    painPointB
      ? {
          question: `Can CleanStmt reduce manual fixes caused by ${bank.shortName} formatting issues?`,
          answer: `Yes. It specifically helps with problems like: ${painPointB} while keeping exports QuickBooks-ready.`,
        }
      : {
          question: `Does CleanStmt keep ${bank.shortName} date and amount formatting consistent?`,
          answer:
            "Yes. Output is normalized into stable date and amount columns to reduce import errors in bookkeeping and accounting systems.",
        },
  ];
}

function getMetadataTemplate(bank: BankConfig): { title: string; description: string } {
  if (bank.segment === "card-issuer") {
    return {
      title: `Convert ${bank.shortName} Card Statement to Excel & CSV | No Merged Cells`,
      description: `Need clean exports from your ${bank.shortName} statement PDF? CleanStmt converts card statements to structured Excel and QuickBooks-ready CSV without merged cells.`,
    };
  }

  if (bank.segment === "regional-bank") {
    return {
      title: `Convert ${bank.shortName} Statement to Excel for Reconciliation | CleanStmt`,
      description: `Extract transactions from ${bank.shortName} statements into reconciliation-ready Excel and CSV with stable date, debit, and credit columns.`,
    };
  }

  if (bank.segment === "wealth-platform") {
    return {
      title: `Convert ${bank.shortName} Financial Statement to Excel & CSV | CleanStmt`,
      description: `Transform ${bank.shortName} statement PDFs into clean transaction tables for bookkeeping and accounting imports with zero merged cells.`,
    };
  }

  return {
    title: `Convert ${bank.shortName} Bank Statement to Excel & CSV | No Merged Cells`,
    description: `Need to extract transactions from your ${bank.shortName} PDF statement? CleanStmt provides a specialized converter with zero merged cells and QuickBooks-ready formatting.`,
  };
}

function getBankSpecificNarrative(bank: BankConfig): string {
  if (bank.segment === "card-issuer") {
    return `${bank.shortName} statements often include card-specific sections such as fees, category blocks, and payment summaries. CleanStmt isolates transaction-level rows so bookkeeping teams can export consistent Excel and QuickBooks-ready CSV without merged cells.`;
  }

  if (bank.segment === "regional-bank") {
    return `${bank.shortName} statement layouts can vary between personal and business account templates. CleanStmt keeps transaction structure stable across pages, making reconciliation and month-end review faster with less manual cleanup.`;
  }

  if (bank.segment === "wealth-platform") {
    return `${bank.shortName} documents may combine transaction activity with investment or account summaries. CleanStmt focuses on extracting clean line-item data so finance teams can move from statement PDF to usable spreadsheets quickly.`;
  }

  if (bank.segment === "digital-bank") {
    return `${bank.shortName} statements are usually compact but can still create wrapped text and spacing issues in generic converters. CleanStmt normalizes dates, descriptions, and amounts into stable columns for reliable exports.`;
  }

  return `${bank.shortName} statements are frequently used in high-volume bookkeeping and reconciliation workflows. CleanStmt is tuned for fast extraction with consistent row alignment so accountants can avoid merged cells and reduce post-export edits.`;
}

export async function generateStaticParams() {
  return getAllBankIds().map((id) => ({ bank: id }));
}

export async function generateMetadata({
  params,
}: BankPageProps): Promise<Metadata> {
  const bank = getBankById(params.bank);

  if (!bank) {
    return {
      title: "Bank Statement Converter | CleanStmt",
      description:
        "Convert bank statements to clean Excel and QuickBooks CSV output.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { title, description } = getMetadataTemplate(bank);
  const url = absoluteUrl(`/convert/${bank.id}`);

  return {
    title,
    description,
    keywords: [
      `convert ${bank.shortName} bank statement to excel`,
      `${bank.shortName} statement converter`,
      `${bank.shortName} statement to quickbooks csv`,
      "bank statement converter no merged cells",
      "quickbooks ready csv",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "CleanStmt",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ConvertBankPage({ params }: BankPageProps) {
  const bank = getBankById(params.bank);

  if (!bank) {
    notFound();
  }

  const faqItems = getFaqItems(bank);
  const relatedBanks = getRelatedBanks(bank.id, 6);
  const sameSegmentBanks = relatedBanks
    .filter((candidate) => candidate.segment === bank.segment)
    .slice(0, 3);
  const comparisonBanks =
    sameSegmentBanks.length > 0 ? sameSegmentBanks : relatedBanks.slice(0, 3);
  const narrative = getBankSpecificNarrative(bank);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Bank Converters",
        item: absoluteUrl("/convert"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: bank.shortName,
        item: absoluteUrl(`/convert/${bank.id}`),
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `CleanStmt ${bank.shortName} Statement Converter`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `Convert ${bank.shortName} bank statements to Excel and QuickBooks-ready CSV with no merged cells.`,
    url: absoluteUrl(`/convert/${bank.id}`),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "No merged cells",
      "QuickBooks-ready CSV",
      "Bank reconciliation friendly output",
      "PDF and screenshot support",
    ],
  };

  return (
    <>
      <Navbar />
      <main className="pb-16 pt-24">
        <CollapsibleToolHero
          badgeText={`${bank.shortName} Statement Converter`}
          title={`How to Convert ${bank.shortName} Bank Statement to Excel`}
          description={bank.description}
          secondaryDescription={bank.conversionHint}
          highlights={[
            "No Merged Cells",
            "QuickBooks Ready CSV",
            "Built for Bank Reconciliation",
          ]}
          panelTitle={`The Best Tool for ${bank.shortName} Statements`}
          panelDescription={`Upload your ${bank.shortName} statement and export a clean file in seconds. No spreadsheet cleanup required.`}
          panelFootnote={`Optimized for ${getSegmentLabel(bank.segment).toLowerCase()} with no merged cells and consistent transaction columns.`}
          previewLabel="Statement Preview Placeholder"
        />

        <section className="mx-auto mt-14 max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-white p-6">
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                How to export your {bank.shortName} statement to Excel in 3
                steps
              </h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-navy-600">
                <li>
                  <strong className="text-navy-800">Step 1:</strong> Upload your
                  {` ${bank.shortName} `}
                  PDF statement or paste a screenshot.
                </li>
                <li>
                  <strong className="text-navy-800">Step 2:</strong> Review
                  extracted rows and confirm the output columns.
                </li>
                <li>
                  <strong className="text-navy-800">Step 3:</strong> Export
                  clean Excel or QuickBooks-ready CSV with no merged cells.
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-6">
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                Common {bank.shortName} statement cleanup issues
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy-600">
                {bank.commonPainPoints.map((issue) => (
                  <li key={issue} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-6 lg:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                What makes {bank.shortName} statement conversion different
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">
                {narrative}
              </p>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-6 lg:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                Compare with similar statement converters
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                Browsing alternatives in the same category helps teams choose the
                right conversion workflow for each statement source.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {comparisonBanks.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/convert/${candidate.id}`}
                    className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-navy-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    Compare {bank.shortName} vs {candidate.shortName}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-surface-200 bg-white p-6 lg:col-span-2">
              <h2 className="text-xl font-bold tracking-tight text-navy-900">
                Related conversion use cases
              </h2>
              <ul className="mt-4 space-y-3">
                {useCases.map((useCaseItem) => (
                  <li key={useCaseItem.id}>
                    <Link
                      href={`/use-cases/${useCaseItem.id}`}
                      className="block rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm text-navy-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {useCaseItem.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <div className="rounded-2xl border border-surface-200 bg-white p-6">
            <h2 className="text-xl font-bold tracking-tight text-navy-900">
              Frequently asked questions for {bank.shortName} conversions
            </h2>
            <div className="mt-4 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-sm font-semibold text-navy-800">
                    {item.question}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-600">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-surface-200 pt-5">
              <h3 className="text-sm font-semibold text-navy-800">
                Related guides
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {useCases.map((useCaseItem) => (
                  <Link
                    key={`faq-link-${useCaseItem.id}`}
                    href={`/use-cases/${useCaseItem.id}`}
                    className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-xs text-navy-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    How this helps with {useCaseItem.h1.toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
            <h2 className="text-lg font-bold tracking-tight text-navy-900">
              Related bank converters
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBanks.map((relatedBank) => (
                <Link
                  key={relatedBank.id}
                  href={`/convert/${relatedBank.id}`}
                  className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-navy-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  Convert {relatedBank.shortName} Statement
                </Link>
              ))}
            </div>
            <Link
              href="/convert"
              className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all supported bank converters
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
