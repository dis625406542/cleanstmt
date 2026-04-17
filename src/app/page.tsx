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

export const metadata: Metadata = {
  title: "CleanStmt - Convert Bank Statements to Excel in Seconds",
  description:
    "AI-powered bank statement converter for CPAs and bookkeepers. Upload PDF or paste screenshot, get clean Excel or QuickBooks CSV with no merged cells. Free, no signup required.",
  keywords: [
    "bank statement to Excel",
    "PDF bank statement converter",
    "QuickBooks CSV import",
    "CPA tools",
    "bookkeeper tools",
    "no merged cells",
    "bank statement parser",
    "AI data extraction",
  ],
  openGraph: {
    title: "CleanStmt - Convert Bank Statements to Excel in Seconds",
    description:
      "Upload a bank statement PDF or paste a screenshot. Get clean, structured Excel data instantly. No merged cells.",
    url: "https://cleanstmt.com",
    siteName: "CleanStmt",
    type: "website",
  },
  alternates: {
    canonical: "https://cleanstmt.com",
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
