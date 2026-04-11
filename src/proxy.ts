import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { RESERVED_SUBDOMAINS } from "@/lib/reserved-subdomains";

function normalizeHost(rawHost: string | null): string {
  return (rawHost ?? "").trim().toLowerCase().split(":")[0];
}

function getTenantSlug(host: string): string | null {
  const rootDomain = process.env.ROOT_DOMAIN?.trim().toLowerCase();

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return null;
  }

  if (host.endsWith(".localhost")) {
    return host.split(".")[0] ?? null;
  }

  if (rootDomain) {
    if (host === rootDomain || host === `www.${rootDomain}`) {
      return null;
    }

    if (host.endsWith(`.${rootDomain}`)) {
      return host.slice(0, -(rootDomain.length + 1)).split(".")[0] ?? null;
    }
  }

  return null;
}

export function proxy(request: NextRequest) {
  const host = normalizeHost(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  );
  const tenantSlug = getTenantSlug(host);
  const requestHeaders = new Headers(request.headers);

  // Keep proxy work header-only so tenant routing stays effectively free.
  if (tenantSlug && !RESERVED_SUBDOMAINS.has(tenantSlug)) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  } else {
    requestHeaders.delete("x-tenant-slug");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};