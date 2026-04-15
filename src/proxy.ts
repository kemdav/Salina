import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { RESERVED_SUBDOMAINS } from "@/lib/reserved-subdomains";
import { getTenantSlugFromHost } from "@/lib/host-routing";

export function proxy(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const tenantSlug = getTenantSlugFromHost(host);
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
