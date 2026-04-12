import "server-only";

import { headers } from "next/headers";

const DEFAULT_ROOT_DOMAIN = "salina.localhost:3000";
const DEFAULT_ROOT_HOST = DEFAULT_ROOT_DOMAIN.replace(/:\d+$/, "");

function normalizeHost(rawHost: string | null) {
  return (rawHost ?? "").trim().toLowerCase();
}

export function getRootDomain() {
  return process.env.ROOT_DOMAIN?.trim() || DEFAULT_ROOT_DOMAIN;
}

export function deriveRootDomainFromHost(rawHost: string | null) {
  const host = normalizeHost(rawHost);

  if (!host) {
    return null;
  }

  const portSuffix = host.match(/:\d+$/)?.[0] ?? "";
  const hostname = host.replace(/:\d+$/, "");
  const localRootDomain = `${DEFAULT_ROOT_HOST}${portSuffix || ":3000"}`;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return localRootDomain;
  }

  if (
    hostname === DEFAULT_ROOT_HOST ||
    hostname.endsWith(`.${DEFAULT_ROOT_HOST}`)
  ) {
    return localRootDomain;
  }

  if (hostname.endsWith(".localhost")) {
    const labels = hostname.split(".");

    if (labels.length < 2) {
      return null;
    }

    return `${labels.slice(1).join(".")}${portSuffix}`;
  }

  const configuredRootDomain = process.env.ROOT_DOMAIN?.trim();
  const normalizedConfiguredDomain = configuredRootDomain
    ?.toLowerCase()
    .replace(/:\d+$/, "");

  if (
    normalizedConfiguredDomain &&
    (hostname === normalizedConfiguredDomain ||
      hostname.endsWith(`.${normalizedConfiguredDomain}`))
  ) {
    return configuredRootDomain;
  }

  return null;
}

export async function getRequestAwareRootDomain() {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  return deriveRootDomainFromHost(requestHost) ?? getRootDomain();
}

export function getCookieDomain(rootDomain: string) {
  const host = rootDomain.replace(/:\d+$/, "");

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return undefined;
  }

  return `.${host.replace(/^\./, "")}`;
}

export async function getTenantAppUrl(tenantSlug: string) {
  const rootDomain = await getRequestAwareRootDomain();
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${tenantSlug}.${rootDomain}`;
}