"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";

export default function SettingsPage() {
  const [defaultFormat, setDefaultFormat] = useState("xlsx");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [autoDelete, setAutoDelete] = useState(true);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-6 w-6 text-brand-500" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Export preferences */}
        <div className="rounded-xl border border-surface-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Export Preferences
          </h2>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Default Export Format
              </label>
              <select
                value={defaultFormat}
                onChange={(e) => setDefaultFormat(e.target.value)}
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">QuickBooks CSV (.csv)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-xl border border-surface-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Privacy &amp; Security
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Auto-delete files after processing
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                All uploaded files will be permanently deleted from memory after
                export
              </p>
            </div>
            <button
              onClick={() => setAutoDelete(!autoDelete)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                autoDelete ? "bg-brand-500" : "bg-surface-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${
                  autoDelete ? "translate-x-[22px]" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
