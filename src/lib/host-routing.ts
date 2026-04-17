export const LOCAL_ROOT_DOMAIN = "salina.localhost:3000";
export const LOCAL_ROOT_HOST = LOCAL_ROOT_DOMAIN.replace(/:\d+$/, "");
export const LOCAL_COOKIE_DOMAIN = `.${LOCAL_ROOT_HOST}`;
export const PRODUCTION_ROOT_DOMAIN = "salina.software";

export interface LocationLike {
  hash: string;
  hostname: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
}

function normalizeHost(rawHost: string | null) {
  return (rawHost ?? "").trim().toLowerCase();
}

function splitHost(rawHost: string | null) {
  const host = normalizeHost(rawHost);
  const portSuffix = host.match(/:\d+$/)?.[0] ?? "";
  const hostname = host.replace(/:\d+$/, "");

  return {
    hostname,
    portSuffix,
  };
}

function isLocalhostFamily(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

function getConfiguredRootDomainHost() {
  const configuredRootDomain = process.env.ROOT_DOMAIN
    ?.trim()
    .toLowerCase()
    .replace(/:\d+$/, "");

  if (configuredRootDomain) {
    return configuredRootDomain;
  }

  return process.env.NODE_ENV === "production" ? PRODUCTION_ROOT_DOMAIN : null;
}

export function isLandingHost(rawHost: string | null) {
  const { hostname } = splitHost(rawHost);

  if (!hostname) {
    return false;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  if (hostname === LOCAL_ROOT_HOST) {
    return true;
  }

  const configuredRootDomain = getConfiguredRootDomainHost();

  if (!configuredRootDomain) {
    return false;
  }

  return (
    hostname === configuredRootDomain ||
    hostname === `www.${configuredRootDomain}`
  );
}

export function deriveRootDomainFromHost(rawHost: string | null) {
  const { hostname, portSuffix } = splitHost(rawHost);

  if (!hostname) {
    return null;
  }

  const localRootDomain = `${LOCAL_ROOT_HOST}${portSuffix || ":3000"}`;

  if (isLocalhostFamily(hostname)) {
    return localRootDomain;
  }

  const configuredRootDomain = getConfiguredRootDomainHost();

  if (
    configuredRootDomain &&
    (hostname === configuredRootDomain ||
      hostname.endsWith(`.${configuredRootDomain}`))
  ) {
    return process.env.ROOT_DOMAIN?.trim() ?? configuredRootDomain;
  }

  return null;
}

export function getCookieDomain(rootDomain: string) {
  const host = rootDomain.trim().toLowerCase().replace(/:\d+$/, "");

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return undefined;
  }

  if (host === LOCAL_ROOT_HOST || host.endsWith(`.${LOCAL_ROOT_HOST}`)) {
    return LOCAL_COOKIE_DOMAIN;
  }

  return `.${host.replace(/^\./, "")}`;
}

export function isLocalRootDomain(rootDomain: string) {
  const host = rootDomain.trim().toLowerCase().replace(/:\d+$/, "");

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === LOCAL_ROOT_HOST ||
    host.endsWith(`.${LOCAL_ROOT_HOST}`)
  );
}

export function getTenantSlugFromHost(rawHost: string | null) {
  const { hostname } = splitHost(rawHost);

  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
  }

  if (hostname === LOCAL_ROOT_HOST || hostname.endsWith(`.${LOCAL_ROOT_HOST}`)) {
    const tenantPrefix = hostname.slice(0, -(LOCAL_ROOT_HOST.length + 1));

    return tenantPrefix ? tenantPrefix.split(".")[0] ?? null : null;
  }

  const configuredRootDomain = getConfiguredRootDomainHost();

  if (
    configuredRootDomain &&
    (hostname === configuredRootDomain ||
      hostname.endsWith(`.${configuredRootDomain}`))
  ) {
    const tenantPrefix = hostname.slice(0, -(configuredRootDomain.length + 1));

    return tenantPrefix ? tenantPrefix.split(".")[0] ?? null : null;
  }

  return null;
}

export function getCanonicalLocalAuthUrl(location: LocationLike) {
  const hostname = normalizeHost(location.hostname);

  if (!hostname || hostname === LOCAL_ROOT_HOST || hostname.endsWith(`.${LOCAL_ROOT_HOST}`)) {
    return null;
  }

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  ) {
    const port = location.port ? `:${location.port}` : ":3000";

    return `${location.protocol}//${LOCAL_ROOT_HOST}${port}${location.pathname}${location.search}${location.hash}`;
  }

  return null;
}
