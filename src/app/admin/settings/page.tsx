"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { BrandingSetupForm } from "@/components/organisms/branding-setup-form";

type Tab = "general" | "branding";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "branding", label: "Branding" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <h1
        className="text-3xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Organization Settings
      </h1>

      {/* Tab nav */}
      <div className="mb-8 mt-6 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-foreground text-foreground"
                : "text-slate-500 hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* GENERAL TAB */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Organization Details */}
          <div className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2
              className="mb-4 text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Organization Details
            </h2>

            <div>
              <Label htmlFor="org-name" className="mb-1.5">
                Organization Name
              </Label>
              <Input id="org-name" placeholder="e.g. Apex Consulting" />
            </div>

            <div>
              <Label htmlFor="org-slug" className="mb-1.5">
                Organization Slug
              </Label>
              <Input
                id="org-slug"
                defaultValue="apex-cons-rqc"
                readOnly
                className="cursor-not-allowed opacity-60"
              />
            </div>

            <div>
              <Label htmlFor="contact-email" className="mb-1.5">
                Contact Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="contact@org.com"
              />
            </div>

            <div>
              <Label htmlFor="org-type" className="mb-1.5">
                Organization Type
              </Label>
              <select
                id="org-type"
                className="h-11 w-full rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option>Professional</option>
                <option>Academic</option>
                <option>Social</option>
                <option>Civic</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="parent-affiliation" className="mb-1.5">
                Parent Affiliation
              </Label>
              <Input
                id="parent-affiliation"
                placeholder="e.g. National Federation"
              />
            </div>

            <Button className="mt-4">Save Changes</Button>
            <div className="mt-3">
              <Link
                href="/admin/roles"
                className="inline-flex h-10 items-center justify-center rounded-(--radius) border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-foreground transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
              >
                Manage Roles
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2
              className="mb-4 text-xl font-bold text-destructive"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Danger Zone
            </h2>
            <p className="mb-3 text-sm text-slate-500">
              Suspending the organization will disable all member access and
              hide the org from public listings until reactivated by a Super
              Admin.
            </p>
            <Button variant="destructive">Suspend Organization</Button>
          </div>
        </div>
      )}

      {/* BRANDING TAB */}
      {activeTab === "branding" && (
        <BrandingSetupForm onThemeConfigChange={() => {}} />
      )}
    </div>
  );
}
