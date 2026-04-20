import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import HeroWithTool from "@/components/landing/HeroWithTool";
import TrustBar from "@/components/landing/TrustBar";
import VisualComparison from "@/components/landing/VisualComparison";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import UseCasesPreview from "@/components/landing/UseCasesPreview";
import SupportedBanks from "@/components/landing/SupportedBanks";
import Footer from "@/components/landing/Footer";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title:
    "Bank Statement to Excel & QuickBooks CSV Converter | No Merged Cells | CleanStmt",
  description:
    "AI-powered bank statement converter for CPAs and bookkeepers. Convert PDF statements to Excel or QuickBooks-ready CSV with no merged cells, stable columns, and reconciliation-friendly output.",
  keywords: [
    "bank statement to excel",
    "pdf bank statement converter",
    "quickbooks csv import",
    "bank statement converter",
    "bank statement parser",
    "bank reconciliation",
    "cpa tools",
    "bookkeeper tools",
    "no merged cells",
    "ai data extraction",
  ],
  openGraph: {
    title:
      "Bank Statement to Excel & QuickBooks CSV Converter | No Merged Cells | CleanStmt",
    description:
      "Convert bank statement PDFs to clean Excel and QuickBooks-ready CSV with AI extraction. Built for reconciliation workflows with no merged cells.",
    url: SITE_URL,
    siteName: "CleanStmt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Bank Statement to Excel & QuickBooks CSV Converter | No Merged Cells | CleanStmt",
    description:
      "AI-powered converter for bank statement PDFs to Excel and QuickBooks CSV with clean columns and no merged cells.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroWithTool />
        <TrustBar />
        <VisualComparison />
        <Features />
        <CTA />
        <UseCasesPreview />
        <SupportedBanks />
      </main>
      <Footer />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "CleanStmt",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "AI-powered tool to convert bank statement PDFs into clean Excel spreadsheets with no merged cells. Built for CPAs and bookkeepers.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "PDF to Excel conversion",
              "Screenshot paste extraction",
              "QuickBooks CSV export",
              "No merged cells guarantee",
              "Bank-grade encryption",
              "Auto-delete in 1 hour",
            ],
          }),
        }}
      />
    </>
  );
}
