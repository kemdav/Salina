import "server-only";

import { headers } from "next/headers";
import { getTenantSlugFromHost } from "@/lib/host-routing";

export type TenantRequestContext = {
  host: string | null;
  tenantSlug: string | null;
};

function normalizeHost(rawHost: string | null): string | null {
  const value = rawHost?.trim().toLowerCase().split(":")[0] ?? "";

  return value || null;
}

export async function getTenantRequestContext(): Promise<TenantRequestContext> {
  const requestHeaders = await headers();
  const host = normalizeHost(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  );

  return {
    host,
    tenantSlug: requestHeaders.get("x-tenant-slug") ?? getTenantSlugFromHost(host),
  };
}