export interface BankConfig {
  id: string;
  fullName: string;
  shortName: string;
  segment:
    | "national-retail"
    | "regional-bank"
    | "card-issuer"
    | "digital-bank"
    | "wealth-platform";
  description: string;
  conversionHint: string;
  commonPainPoints: string[];
}

export const bankSegmentLabels: Record<BankConfig["segment"], string> = {
  "national-retail": "National Banks",
  "regional-bank": "Regional Banks",
  "card-issuer": "Card Issuers",
  "digital-bank": "Digital Banks",
  "wealth-platform": "Wealth Platforms",
};

export const bankSegmentOrder: BankConfig["segment"][] = [
  "national-retail",
  "regional-bank",
  "card-issuer",
  "digital-bank",
  "wealth-platform",
];

export const banks: BankConfig[] = [
  {
    id: "chase",
    fullName: "JPMorgan Chase",
    shortName: "Chase",
    segment: "national-retail",
    description:
      "Convert Chase statement PDFs into clean Excel and QuickBooks CSV with consistent debit and credit columns.",
    conversionHint:
      "Chase exports often include dense memo fields. CleanStmt keeps row alignment stable with zero merged cells.",
    commonPainPoints: [
      "Long memo descriptions can push amounts out of alignment in generic PDF converters.",
      "Multi-page statement exports may break running balances into inconsistent rows.",
    ],
  },
  {
    id: "bank-of-america",
    fullName: "Bank of America",
    shortName: "Bank of America",
    segment: "national-retail",
    description:
      "Extract Bank of America transactions into bookkeeping-ready Excel with normalized date and amount formatting.",
    conversionHint:
      "BoA layouts can vary by account type. CleanStmt maps each row into predictable columns for reconciliation.",
    commonPainPoints: [
      "Personal and business account statements can use different section headers.",
      "Summary blocks often interrupt transaction flow in standard conversion tools.",
    ],
  },
  {
    id: "wells-fargo",
    fullName: "Wells Fargo",
    shortName: "Wells Fargo",
    segment: "national-retail",
    description:
      "Transform Wells Fargo statements into audit-ready CSV without merged cells or broken transaction rows.",
    conversionHint:
      "Wells Fargo statement headers may shift across pages. CleanStmt preserves clean tabular structure automatically.",
    commonPainPoints: [
      "Header repetition across pages can create duplicate rows in exports.",
      "Amount columns can split when statement line descriptions are long.",
    ],
  },
  {
    id: "citibank",
    fullName: "Citibank",
    shortName: "Citibank",
    segment: "national-retail",
    description:
      "Convert Citibank statement PDFs to Excel in seconds with QuickBooks-ready transaction formatting.",
    conversionHint:
      "Citibank pages can include extra summary blocks. CleanStmt isolates transaction rows from non-transaction content.",
    commonPainPoints: [
      "Statement summaries can be mistaken for transactions by generic OCR tools.",
      "Date and posting-date values may get merged into one cell after conversion.",
    ],
  },
  {
    id: "capital-one",
    fullName: "Capital One",
    shortName: "Capital One",
    segment: "card-issuer",
    description:
      "Get clean Capital One statement data in Excel and CSV for month-end bookkeeping and reconciliation.",
    conversionHint:
      "Capital One statement files often mix card and account details. CleanStmt extracts only the rows you need.",
    commonPainPoints: [
      "Credit card and account metadata can pollute exported transaction tables.",
      "Statement notes may shift debit and credit values into the wrong columns.",
    ],
  },
  {
    id: "us-bank",
    fullName: "U.S. Bank",
    shortName: "U.S. Bank",
    segment: "national-retail",
    description:
      "Export U.S. Bank statements into normalized spreadsheets that are easy to import into accounting systems.",
    conversionHint:
      "U.S. Bank statement totals and notes can interrupt row flow. CleanStmt keeps transactions in clean line-by-line output.",
    commonPainPoints: [
      "Ending balance and subtotal lines can be pulled in as fake transactions.",
      "Wrapped descriptions often create merged cells in spreadsheet output.",
    ],
  },
  {
    id: "pnc-bank",
    fullName: "PNC Bank",
    shortName: "PNC Bank",
    segment: "regional-bank",
    description:
      "Convert PNC Bank PDF statements to CSV with stable columns built for QuickBooks and Xero workflows.",
    conversionHint:
      "PNC statement spacing can cause split rows in generic converters. CleanStmt keeps each transaction on one row.",
    commonPainPoints: [
      "Inconsistent spacing can cause one transaction to become multiple rows.",
      "Debit and credit indicators may be dropped during extraction.",
    ],
  },
  {
    id: "truist-bank",
    fullName: "Truist Bank",
    shortName: "Truist Bank",
    segment: "regional-bank",
    description:
      "Prepare Truist Bank statement data for accounting with no merged cells and reconciliation-friendly exports.",
    conversionHint:
      "Truist statements may include variable section formatting. CleanStmt standardizes output into one clean table.",
    commonPainPoints: [
      "Variable section labels can confuse template-based parsers.",
      "Page breaks frequently split merchant descriptions and transaction amounts.",
    ],
  },
  {
    id: "goldman-sachs-marcus",
    fullName: "Goldman Sachs (Marcus)",
    shortName: "Marcus",
    segment: "wealth-platform",
    description:
      "Extract Marcus by Goldman Sachs statement transactions into Excel with clean columns for finance teams.",
    conversionHint:
      "Marcus statements are compact but can include dense metadata. CleanStmt outputs only structured transaction rows.",
    commonPainPoints: [
      "Compact layouts can merge metadata and transaction rows together.",
      "Balance and interest lines are often mixed into transaction exports.",
    ],
  },
  {
    id: "td-bank",
    fullName: "TD Bank",
    shortName: "TD Bank",
    segment: "national-retail",
    description:
      "Convert TD Bank statements into QuickBooks-ready CSV while preserving transaction order and balance flow.",
    conversionHint:
      "TD Bank layouts can include long descriptions. CleanStmt keeps descriptions and amounts aligned across rows.",
    commonPainPoints: [
      "Long transaction text often causes value columns to shift in CSV exports.",
      "Daily balance lines can be misread as transaction entries.",
    ],
  },
  {
    id: "american-express",
    fullName: "American Express",
    shortName: "American Express",
    segment: "card-issuer",
    description:
      "Turn American Express statements into accountant-friendly Excel files without manual cleanup.",
    conversionHint:
      "AMEX statements can contain category sections and fees. CleanStmt keeps a flat transaction table for export.",
    commonPainPoints: [
      "Category headers can be extracted as line items in generic OCR output.",
      "Fee and adjustment rows may lose consistent credit/debit formatting.",
    ],
  },
  {
    id: "discover-bank",
    fullName: "Discover Bank",
    shortName: "Discover Bank",
    segment: "card-issuer",
    description:
      "Convert Discover Bank statement PDFs into clear spreadsheets designed for bookkeeping and reconciliation.",
    conversionHint:
      "Discover layouts may include sparse spacing. CleanStmt prevents merged-cell artifacts in exported files.",
    commonPainPoints: [
      "Sparse spacing can lead to merged cells in amount and date columns.",
      "Statement notes sometimes get inserted between valid transactions.",
    ],
  },
  {
    id: "charles-schwab",
    fullName: "Charles Schwab",
    shortName: "Charles Schwab",
    segment: "wealth-platform",
    description:
      "Extract Charles Schwab statement transactions into clean Excel rows for faster financial operations.",
    conversionHint:
      "Schwab statements often include investment details. CleanStmt focuses export output on transaction-level data.",
    commonPainPoints: [
      "Investment activity and banking activity can overlap in the same document.",
      "Position summaries are often mistaken for transaction rows.",
    ],
  },
  {
    id: "ally-bank",
    fullName: "Ally Bank",
    shortName: "Ally Bank",
    segment: "digital-bank",
    description:
      "Convert Ally Bank statements to CSV and Excel with no merged cells and consistent transaction columns.",
    conversionHint:
      "Ally statement sections can shift by product. CleanStmt standardizes rows for dependable accounting imports.",
    commonPainPoints: [
      "Different Ally account products can output different statement sections.",
      "Row alignment breaks when transaction descriptions wrap across lines.",
    ],
  },
  {
    id: "citizens-bank",
    fullName: "Citizens Bank",
    shortName: "Citizens Bank",
    segment: "regional-bank",
    description:
      "Generate clean Citizens Bank statement exports for QuickBooks and month-end reconciliation.",
    conversionHint:
      "Citizens statement data may include summary interruptions. CleanStmt keeps transaction records in a clean sequence.",
    commonPainPoints: [
      "Summary interruptions can create malformed rows in standard PDF-to-Excel tools.",
      "Date formats may become inconsistent after manual spreadsheet cleanup.",
    ],
  },
];

export function getBankById(id: string): BankConfig | undefined {
  return banks.find((bank) => bank.id === id);
}

export function getAllBankIds(): string[] {
  return banks.map((bank) => bank.id);
}

export function getRelatedBanks(bankId: string, limit = 6): BankConfig[] {
  const current = getBankById(bankId);
  if (!current) return banks.slice(0, limit);

  const sameSegment = banks.filter(
    (bank) => bank.id !== current.id && bank.segment === current.segment
  );
  const fallback = banks.filter(
    (bank) => bank.id !== current.id && bank.segment !== current.segment
  );

  return [...sameSegment, ...fallback].slice(0, limit);
}

export function getSegmentLabel(segment: BankConfig["segment"]): string {
  return bankSegmentLabels[segment];
}
