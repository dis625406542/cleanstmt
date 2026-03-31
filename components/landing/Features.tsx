import {
  FileSpreadsheet,
  Clipboard,
  ScanLine,
  Layers,
  Sparkles,
  Download,
} from "lucide-react";

const features = [
  {
    icon: FileSpreadsheet,
    title: "PDF Batch Upload",
    desc: "Drag & drop multiple bank statement PDFs. Chase, BofA, Wells Fargo, and 200+ formats supported.",
  },
  {
    icon: Clipboard,
    title: "Screenshot Paste",
    desc: "Paste a screenshot of any table and extract structured data instantly. Our killer feature.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    desc: "Smart recognition of Date, Vendor, Category, Debit, Credit, and Balance columns.",
  },
  {
    icon: ScanLine,
    title: "Zero Merged Cells",
    desc: "Every row is an independent record. No more manually splitting cells before importing.",
  },
  {
    icon: Layers,
    title: "QuickBooks Ready",
    desc: "Export directly to QuickBooks-compatible CSV. Skip the reformatting step entirely.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    desc: "Download as Excel (.xlsx), QuickBooks CSV, or copy structured data to clipboard.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-surface-200 bg-surface-100/50 py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy-900">
            Built for Accounting Professionals
          </h2>
          <p className="mt-3 text-navy-400">
            Every feature saves CPAs and bookkeepers hours of manual data entry.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:border-navy-200 hover:shadow-elevated"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-navy-900">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-navy-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
