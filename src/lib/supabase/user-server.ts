import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getCookieDomain, isLocalRootDomain } from "@/lib/host-routing";
import { getRequestAwareRootDomain } from "@/lib/root-domain";

export async function createUserClient(cookieDomainOverride?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();
  const rootDomain = await getRequestAwareRootDomain();
  const cookieDomain = isLocalRootDomain(rootDomain)
    ? cookieDomainOverride ?? getCookieDomain(rootDomain)
    : getCookieDomain(rootDomain);

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            });
          });
        } catch {
          // Ignore cookie writes when Next.js disallows mutation in the current render path.
        }
      },
    },
  });
}
