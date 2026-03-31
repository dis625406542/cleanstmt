import Link from "next/link";
import { FileCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-10 xl:px-16">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900">
            <FileCheck className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-navy-900">CleanStmt</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-navy-400">
          <Link href="/privacy" className="hover:text-navy-700">
            Privacy Policy
          </Link>
          <span>
            &copy; {new Date().getFullYear()} CleanStmt. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
