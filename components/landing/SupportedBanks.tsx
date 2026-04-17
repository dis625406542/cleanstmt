import Link from "next/link";
import { banks } from "@/lib/banks";

export default function SupportedBanks() {
  return (
    <section className="border-t border-surface-200 bg-white py-14">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 xl:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-400">
          Supported Banks
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-900 lg:text-3xl">
          Popular Converters for Bank-Specific Statements
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-500">
          CleanStmt gives each bank its own conversion page so you can extract
          transaction data with no merged cells and QuickBooks-ready formatting.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
          <Link href="/convert" className="text-brand-700 hover:text-brand-800">
            View full bank converter library
          </Link>
          <Link
            href="/use-cases"
            className="text-brand-700 hover:text-brand-800"
          >
            Browse conversion use cases
          </Link>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {banks.map((bank) => (
            <li key={bank.id}>
              <Link
                href={`/convert/${bank.id}`}
                className="group flex items-center justify-between rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-sm font-medium text-navy-700 group-hover:text-brand-700">
                  {bank.shortName}
                </span>
                <span className="text-xs text-navy-400 group-hover:text-brand-500">
                  /convert/{bank.id}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
