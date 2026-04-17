import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-navy-900 py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          Stop Wasting Hours on Messy Spreadsheets
        </h2>
        <p className="mt-4 text-base text-navy-300">
          Join thousands of CPAs who convert bank statements in seconds, not
          hours. No signup required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/#upload-tool"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition-all hover:bg-navy-50"
          >
            Try CleanStmt Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="/app/review"
            className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            View Excel Sample
          </a>
        </div>
      </div>
    </section>
  );
}
