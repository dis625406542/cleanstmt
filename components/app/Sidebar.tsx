"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  FileStack,
  Trash2,
  Settings,
  FileCheck,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/app/history", icon: Clock, label: "History" },
  { href: "/app/review", icon: FileStack, label: "Recent Statements" },
  { href: "/app/trash", icon: Trash2, label: "Trash" },
];

const bottomItems = [
  { href: "/app/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500">
          <FileCheck className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-white">CleanStmt</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-navy-300 hover:bg-white/[0.06] hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-3 py-4">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-navy-300 hover:bg-white/[0.06] hover:text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-navy-200 bg-white text-navy-600 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-navy-900">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-navy-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "relative hidden h-screen shrink-0 flex-col bg-navy-900 transition-all duration-300 lg:flex",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-400 shadow-sm hover:text-navy-600"
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </aside>
    </>
  );
}
