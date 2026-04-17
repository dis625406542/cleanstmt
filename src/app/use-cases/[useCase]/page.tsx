import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CollapsibleToolHero from "@/components/landing/CollapsibleToolHero";
import { banks } from "@/lib/banks";
import { getUseCaseById, useCases } from "@/lib/use-cases";

interface UseCasePageProps {
  params: {
    useCase: string;
  };
}

export async function generateStaticParams() {
  return useCases.map((useCaseItem) => ({ useCase: useCaseItem.id }));
}

export async function generateMetadata({
  params,
}: UseCasePageProps): Promise<Metadata> {
  const useCaseItem = getUseCaseById(params.useCase);

  if (!useCaseItem) {
    return {
      title: "Use Case | CleanStmt",
      robots: { index: false, follow: false },
    };
  }

  const url = `https://cleanstmt.com/use-cases/${useCaseItem.id}`;
  return {
    title: useCaseItem.title,
    description: useCaseItem.description,
    keywords: [
      useCaseItem.primaryKeyword,
      "bank statement converter no merged cells",
      "quickbooks ready csv",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: useCaseItem.title,
      description: useCaseItem.description,
      url,
      siteName: "CleanStmt",
      type: "website",
    },
  };
}

export default function UseCasePage({ params }: UseCasePageProps) {
  const useCaseItem = getUseCaseById(params.useCase);

  if (!useCaseItem) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cleanstmt.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Use Cases",
        item: "https://cleanstmt.com/use-cases",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: useCaseItem.h1,
        item: `https://cleanstmt.com/use-cases/${useCaseItem.id}`,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="pb-16 pt-24">
        <CollapsibleToolHero
          badgeText="Use Case"
          title={useCaseItem.h1}
          description={useCaseItem.description}
          secondaryDescription="Use the same upload flow to convert files into clean, accounting-ready output with no merged cells."
          highlights={useCaseItem.steps}
          panelTitle="Apply this workflow in seconds"
          panelDescription="Upload your file, review the extracted table, and export clean Excel or CSV output for accounting tools."
          panelFootnote={`Primary keyword focus: ${useCaseItem.primaryKeyword}`}
          previewLabel="Workflow Preview Placeholder"
        />

        <section className="mx-auto mt-10 max-w-[1440px] px-6 lg:px-10 xl:px-16">
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
            <h2 className="text-lg font-bold tracking-tight text-navy-900">
              Popular bank statement converters
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {banks.slice(0, 9).map((bank) => (
                <Link
                  key={bank.id}
                  href={`/convert/${bank.id}`}
                  className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-navy-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                >
                  Convert {bank.shortName} Statement
                </Link>
              ))}
            </div>
            <Link
              href="/use-cases"
              className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all conversion use cases
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
