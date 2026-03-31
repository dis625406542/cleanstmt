"use client";

import { Trash2 } from "lucide-react";

export default function TrashPage() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Trash2 className="h-6 w-6 text-brand-500" />
        <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 py-20">
        <Trash2 className="mb-3 h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">Trash is empty</p>
        <p className="mt-1 text-xs text-gray-400">
          Deleted statements are permanently removed after 24 hours
        </p>
      </div>
    </div>
  );
}
