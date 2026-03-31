"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FileCheck } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#security", label: "Security" },
  { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#FAF9F7]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-10 xl:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
            <FileCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-navy-900">
            CleanStmt
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-navy-500 transition-colors hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu btn */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-navy-600 hover:bg-navy-50 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-navy-100 bg-[#FAF9F7] px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-sm font-medium text-navy-600"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
