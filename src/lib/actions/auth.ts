"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";

const DEFAULT_ROOT_DOMAIN = "salina.localhost:3000";

// 1. Zod schema validates email format and minimum password length at the server boundary
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function getRootDomain() {
  return process.env.ROOT_DOMAIN?.trim() || DEFAULT_ROOT_DOMAIN;
}

function normalizeHost(rawHost: string | null) {
  return (rawHost ?? "").trim().toLowerCase();
}

function deriveRootDomainFromHost(rawHost: string | null) {
  const host = normalizeHost(rawHost);

  if (!host) {
    return null;
  }

  const portSuffix = host.match(/:\d+$/)?.[0] ?? "";
  const hostname = host.replace(/:\d+$/, "");

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null;
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

async function getRequestAwareRootDomain() {
  const requestHeaders = await headers();
  const requestHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  return deriveRootDomainFromHost(requestHost) ?? getRootDomain();
}

function getCookieDomain(rootDomain: string) {
  const host = rootDomain.replace(/:\d+$/, "");

  if (!host || host === "localhost" || host === "127.0.0.1") {
    return undefined;
  }

  return `.${host.replace(/^\./, "")}`;
}

// A factory for the user-scoped Supabase client inside Server Actions,
// hooking directly into Next.js 16 cookies() for native HTTP session storage.
async function createUserClient() {
  const cookieStore = await cookies();
  const rootDomain = await getRequestAwareRootDomain();
  const cookieDomain = getCookieDomain(rootDomain);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function signIn(email: string, password: string) {
  const parsed = loginSchema.safeParse({
    email,
    password,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // 2. The Supabase client used for auth is the user-scoped client
  const supabase = await createUserClient();

  // 3. Call Supabase Auth, write the session cookie inherently via our cookieStore override
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    return { error: error?.message || "Invalid credentials" };
  }

  // 4. Validate the returned JWT contains app_metadata.tenant_id
  const tenantId = data.user.app_metadata?.tenant_id;
  if (!tenantId) {
    await supabase.auth.signOut();
    return {
      error: "Security exception: User has no mapped tenant ID in JWT.",
    };
  }

  // 5. Query organization_memberships table to confirm active membership
  // Since this relies on the user-scoped client, RLS checks their tenant scope immediately
  const { data: membership, error: membershipError } = await supabase
    .from("organization_memberships")
    .select("role, tenant_id")
    .eq("tenant_id", tenantId)
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (membershipError) {
    await supabase.auth.signOut();
    return { error: "Unable to verify organization membership." };
  }

  if (!membership) {
    await supabase.auth.signOut(); // Revoke the session
    return { error: "No active membership found for this organization." };
  }

  // 6. Redirect to the tenant shell
  // Note: Depending on your exact domain mapping strategy, the organization slug resolves the tenant subdomain.
  // In production it uses `${tenantSlug}.${ROOT_DOMAIN}`, locally `${tenantSlug}.localhost:3000`.
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("slug")
    .eq("id", tenantId)
    .single();

  if (orgError || !orgData) {
    await supabase.auth.signOut();
    return { error: "Organization record not located." };
  }

  const rootDomain = await getRequestAwareRootDomain();
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Navigate user securely into their scoped domain subdomain shell
  redirect(`${protocol}://${orgData.slug}.${rootDomain}`);
}

export async function signOut() {
  const supabase = await createUserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}
