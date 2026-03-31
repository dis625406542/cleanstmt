import type { Metadata } from "next";
import Sidebar from "@/components/app/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard - CleanStmt",
  description:
    "Upload and convert bank statements to clean Excel or QuickBooks CSV.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 pt-16 lg:px-10 lg:pt-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
