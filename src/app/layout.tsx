import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CleanStmt - Extract Clean Data from Bank Statements to Excel",
  description:
    "Stop fighting with messy PDFs. Convert bank statements to accounting-ready Excel or QuickBooks CSV in seconds. No merged cells, no formatting issues.",
  icons: {
    icon: [
      { url: "/brand/logo-concept-a.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/brand/logo-concept-a.svg"],
    apple: [{ url: "/brand/logo-concept-a.svg" }],
  },
  keywords: [
    "bank statement converter",
    "PDF to Excel",
    "QuickBooks CSV",
    "CPA tools",
    "bookkeeper tools",
    "bank statement to Excel",
    "no merged cells",
  ],
  openGraph: {
    title: "CleanStmt - Extract Clean Data from Bank Statements",
    description:
      "Convert messy bank statement PDFs to clean Excel or QuickBooks CSV. Built for CPAs and bookkeepers.",
    url: SITE_URL,
    siteName: "CleanStmt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CleanStmt - Bank Statement PDF to Clean Excel",
    description:
      "No more merged cells. Convert bank statements to accounting-ready spreadsheets in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const shouldLoadAdsense =
    typeof adsenseClient === "string" &&
    adsenseClient.trim().startsWith("ca-pub-");

  return (
    <html lang="en">
      <body>
        {shouldLoadAdsense ? (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient.trim()}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
