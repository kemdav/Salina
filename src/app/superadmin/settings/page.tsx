"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";

const LOG_ENTRIES = [
  {
    title: "DB Migration Completed",
    description: "System schema v2.47 deployed successfully.",
    time: "4 HOURS AGO",
  },
  {
    title: "New Admin Registered",
    description: "User James T. assigned Super Admin role.",
    time: "YESTERDAY",
  },
];

export default function SettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [primaryLanguage, setPrimaryLanguage] = useState("en-us");
  const [timezone, setTimezone] = useState("america-pacific");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <h1
        className="text-3xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Platform Settings
      </h1>

      {/* Two-column grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT — Governance */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Governance
          </p>

          <div className="space-y-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
            {/* Platform Security */}
            <div>
              <h2
                className="mb-4 text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Platform Security
              </h2>

              {/* MFA Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Multi-Factor Authentication
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Require MFA for all administrative accounts.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={mfaEnabled}
                  onClick={() => setMfaEnabled((v) => !v)}
                  className={`relative h-6 w-10 cursor-pointer rounded-full transition-colors ${
                    mfaEnabled ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      mfaEnabled
                        ? "left-1 translate-x-4"
                        : "left-1 translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Session Timeout */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Session Timeout (minutes)
                </p>
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-20 text-center"
                />
              </div>

              {/* IP Whitelist */}
              <div className="mt-6">
                <p className="text-sm font-medium text-foreground">
                  IP Whitelist
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    192.168.1.0/24
                    <button
                      type="button"
                      className="text-slate-400 transition-colors hover:text-foreground"
                      aria-label="Remove IP range"
                    >
                      ×
                    </button>
                  </span>
                  <button
                    type="button"
                    className="cursor-pointer text-xs text-primary hover:underline"
                  >
                    + ADD IP RANGE
                  </button>
                </div>
              </div>
            </div>

            {/* User Roles & Permissions */}
            <div className="border-t border-border pt-6">
              <h2
                className="mb-4 text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                User Roles &amp; Permissions
              </h2>

              <div className="overflow-hidden rounded-xl border border-border bg-slate-50/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Role Name", "Users", "Access Level", "Actions"].map(
                        (col) => (
                          <th
                            key={col}
                            className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        Super Administrator
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        4 active
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          GLOBAL
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-xs text-slate-500 transition-colors hover:text-foreground"
                        >
                          VIEW DETAILS
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        Org Coordinator
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        84 active
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          LIMITED
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="text-xs text-slate-500 transition-colors hover:text-foreground"
                        >
                          EDIT ACCESS
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="border-t border-border pt-6">
              <h2
                className="mb-4 text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Audit Logs
              </h2>

              {/* Recent high-priority card */}
              <div className="mb-3 rounded-xl border border-border bg-slate-50 p-4">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">
                  Recent High-Priority
                </p>
                <p
                  className="text-base font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Auth Policy Updated
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  MFA enforcement policy changed for administrative accounts.
                </p>
                <p className="mt-2 text-xs text-slate-500">2 hours ago</p>
              </div>

              {/* Log entries */}
              {LOG_ENTRIES.map((entry) => (
                <div
                  key={entry.title}
                  className="mb-2 flex items-start gap-3 rounded-xl border border-border bg-white p-4"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-slate-50 text-slate-400 text-xs">
                    ⏱
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {entry.description}
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {entry.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Localization */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Localization
          </p>

          <div className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div>
              <h2
                className="mb-4 text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Global Defaults
              </h2>

              {/* Primary Language */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Primary Language
                </label>
                <Select
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                  className="w-full"
                >
                  <option value="en-us">English (United States)</option>
                  <option value="fil">Filipino</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="zh">Chinese (Simplified)</option>
                </Select>
              </div>

              {/* Default Timezone */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Default Timezone
                </label>
                <Select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full"
                >
                  <option value="america-pacific">
                    (GMT-08:00) Pacific Time
                  </option>
                  <option value="america-mountain">
                    (GMT-07:00) Mountain Time
                  </option>
                  <option value="america-central">
                    (GMT-06:00) Central Time
                  </option>
                  <option value="america-eastern">
                    (GMT-05:00) Eastern Time
                  </option>
                  <option value="asia-manila">(GMT+08:00) Asia/Manila</option>
                  <option value="europe-london">
                    (GMT+00:00) Europe/London
                  </option>
                </Select>
              </div>

              {/* Date Presentation */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Date Presentation
                </label>
                <div className="flex flex-col gap-2">
                  {["MM/DD/YYYY", "DD/MM/YYYY"].map((fmt) => (
                    <label
                      key={fmt}
                      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                    >
                      <input
                        type="radio"
                        name="dateFormat"
                        value={fmt}
                        checked={dateFormat === fmt}
                        onChange={() => setDateFormat(fmt)}
                        className="accent-primary"
                      />
                      {fmt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-8 flex justify-end gap-3">
        <Button type="button" variant="secondary">
          Reset changes
        </Button>
        <Button type="button">Save System Settings</Button>
      </div>
    </div>
  );
}
