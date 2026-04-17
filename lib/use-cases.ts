export interface UseCaseConfig {
  id: string;
  title: string;
  description: string;
  h1: string;
  steps: string[];
  primaryKeyword: string;
}

export const useCases: UseCaseConfig[] = [
  {
    id: "bank-reconciliation",
    title: "Convert PDF to Excel for Bank Reconciliation | CleanStmt",
    description:
      "Prepare reconciliation-ready bank statement data from PDF files with normalized columns and zero merged cells.",
    h1: "Convert PDF Statements to Excel for Bank Reconciliation",
    primaryKeyword: "convert pdf to excel for bank reconciliation",
    steps: [
      "Upload your bank statement PDF or paste a screenshot.",
      "Let CleanStmt extract transactions into clean columns with no merged cells.",
      "Download Excel or CSV and match line items in your reconciliation workflow.",
    ],
  },
  {
    id: "quickbooks-csv",
    title: "Bank Statement to QuickBooks CSV Converter | CleanStmt",
    description:
      "Convert statement PDFs into QuickBooks-ready CSV files with stable debit, credit, and date formatting.",
    h1: "Convert Bank Statements to QuickBooks-Ready CSV",
    primaryKeyword: "bank statement to quickbooks csv converter",
    steps: [
      "Upload your statement file and preview extracted transaction rows.",
      "Verify date and amount formatting before export.",
      "Export a clean CSV file ready for QuickBooks import.",
    ],
  },
  {
    id: "scanned-invoice-to-csv",
    title: "Convert Scanned Invoices to QuickBooks CSV | CleanStmt",
    description:
      "Turn scanned invoice images into structured CSV output with clean rows for accounting and bookkeeping tools.",
    h1: "Convert Scanned Invoices to QuickBooks CSV",
    primaryKeyword: "best tool to convert scanned invoices to quickbooks csv",
    steps: [
      "Drop your scanned invoice image or PDF into the tool.",
      "Review extracted table rows and keep only relevant accounting columns.",
      "Download CSV output and import into your bookkeeping workflow.",
    ],
  },
];

export function getUseCaseById(id: string): UseCaseConfig | undefined {
  return useCases.find((useCaseItem) => useCaseItem.id === id);
}
