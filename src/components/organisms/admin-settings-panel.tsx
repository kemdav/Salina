"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  BrandingSetupForm,
  type BrandingThemeConfig,
} from "@/components/organisms/branding-setup-form";
import {
  updateOrganizationSettings,
  type OrganizationSettingsState,
} from "@/lib/actions/organization-settings";

type TenantSettings = {
  billingEmail: string | null;
  id: string;
  name: string;
  organizationType: string | null;
  slug: string;
  themeConfig: {
    fontFamily?: string | null;
    logoUrl?: string | null;
    primaryColor?: string | null;
  };
};

type Tab = "general" | "branding";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "branding", label: "Branding" },
];

const ORGANIZATION_TYPE_OPTIONS = [
  "Professional",
  "Academic",
  "Social",
  "Civic",
  "Other",
];

const INITIAL_STATE: OrganizationSettingsState = {};

export function AdminSettingsPanel({ tenant }: { tenant: TenantSettings }) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [brandingThemeConfig, setBrandingThemeConfig] =
    useState<BrandingThemeConfig>({
      fontFamily:
        tenant.themeConfig.fontFamily ?? "var(--font-heading), sans-serif",
      logoUrl: tenant.themeConfig.logoUrl ?? "",
      primaryColor: tenant.themeConfig.primaryColor ?? "#c6623e",
    });
  const [generalState, generalAction, generalPending] = useActionState(
    updateOrganizationSettings,
    INITIAL_STATE,
  );
  const [brandingState, brandingAction, brandingPending] = useActionState(
    updateOrganizationSettings,
    INITIAL_STATE,
  );

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <h1
        className="text-3xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Organization Settings
      </h1>

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

      {generalState.error ? (
        <p className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {generalState.error}
        </p>
      ) : null}

      {generalState.success ? (
        <p className="mb-4 rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
          {generalState.success}
        </p>
      ) : null}

      {brandingState.error ? (
        <p className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {brandingState.error}
        </p>
      ) : null}

      {brandingState.success ? (
        <p className="mb-4 rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
          {brandingState.success}
        </p>
      ) : null}

      {activeTab === "general" ? (
        <form
          action={generalAction}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
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
              <Input
                id="org-name"
                name="name"
                defaultValue={tenant.name}
                placeholder="e.g. Apex Consulting"
              />
            </div>

            <div>
              <Label htmlFor="org-slug" className="mb-1.5">
                Organization Slug
              </Label>
              <Input
                id="org-slug"
                defaultValue={tenant.slug}
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
                name="billingEmail"
                type="email"
                defaultValue={tenant.billingEmail ?? ""}
                placeholder="contact@org.com"
              />
            </div>

            <div>
              <Label htmlFor="org-type" className="mb-1.5">
                Organization Type
              </Label>
              <select
                id="org-type"
                name="organizationType"
                defaultValue={tenant.organizationType ?? ""}
                className="h-11 w-full rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select a type</option>
                {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Button className="mt-4" type="submit" disabled={generalPending}>
              {generalPending ? "Saving..." : "Save Changes"}
            </Button>
            <div className="mt-3">
              <Link
                href="/admin/roles"
                className="inline-flex h-10 items-center justify-center rounded-(--radius) border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-foreground transition-all duration-200 hover:bg-slate-50 active:bg-slate-100"
              >
                Manage Roles
              </Link>
            </div>
          </div>

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
        </form>
      ) : null}

      {activeTab === "branding" ? (
        <form action={brandingAction} className="space-y-4">
          <input
            type="hidden"
            name="themeConfig"
            value={JSON.stringify(brandingThemeConfig)}
          />
          <BrandingSetupForm
            initialThemeConfig={brandingThemeConfig}
            onThemeConfigChange={setBrandingThemeConfig}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={brandingPending}>
              {brandingPending ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
