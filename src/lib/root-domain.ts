import "server-only";

import { headers } from "next/headers";

import {
  deriveRootDomainFromHost,
  LOCAL_ROOT_DOMAIN,
} from "@/lib/host-routing";

export function getRootDomain() {
  return process.env.ROOT_DOMAIN?.trim() || LOCAL_ROOT_DOMAIN;
}

export async function getRequestAwareRootDomain() {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  return deriveRootDomainFromHost(requestHost) ?? getRootDomain();
}

export async function getTenantAppUrl(tenantSlug: string) {
  const rootDomain = await getRequestAwareRootDomain();
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${tenantSlug}.${rootDomain}`;
}
