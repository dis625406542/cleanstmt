import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    url: "https://cleanstmt.com",
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
