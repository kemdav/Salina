"use client";

import { useTenant } from "@/components/providers/tenant-provider";

export function TenantNameBadge() {
  const { tenant, tenantSlug } = useTenant();

  return (
    <div className="mt-4 rounded-md border border-stone-700 bg-stone-800/50 p-3 text-xs text-stone-300">
      <p className="mb-1 font-semibold text-stone-100">Client Component Test</p>
      <p>Name: {tenant?.name}</p>
      <p>Slug: {tenantSlug}</p>
      <p>Primary Color: {tenant?.themeConfig?.primaryColor || "Default"}</p>
    </div>
  );
}
