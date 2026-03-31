import { Lock, Clock, ServerOff, Eye } from "lucide-react";

const trustItems = [
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    desc: "256-bit SSL in transit",
  },
  {
    icon: ServerOff,
    title: "In-Memory Processing",
    desc: "Never touches disk",
  },
  {
    icon: Clock,
    title: "Auto-Wipe in 1 Hour",
    desc: "All data destroyed",
  },
  {
    icon: Eye,
    title: "No Human Access",
    desc: "AI-only, zero review",
  },
];

export default function TrustBar() {
  return (
    <section id="security" className="border-y border-surface-200 bg-surface-100/60">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4 lg:px-10 xl:px-16">
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-800">
                {item.title}
              </p>
              <p className="text-[11px] text-navy-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
