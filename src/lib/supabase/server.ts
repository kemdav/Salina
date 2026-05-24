import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { getAuthSessionClaims } from "@/lib/auth-policy";
import { getTenantRequestContext } from "@/lib/tenant";

export type ThemeConfig = {
  fontFamily?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
};

type OrganizationRecord = {
  billing_email: string | null;
  id: string;
  name: string;
  organization_type: string | null;
  plan: string;
  slug: string;
  status: "pending" | "active" | "suspended";
  theme_config: ThemeConfig;
};

export type ViewerContext = {
  email: string | null;
  id: string;
  isPlatformAdmin: boolean;
  isTemporaryApplicant: boolean;
  tenantRole: string | null;
  customPermissions: string[];
  tenantId: string | null;
  tenantSlug: string | null;
};

export type TenantContext = {
  host: string | null;
  resolutionError: string | null;
  resolvedBy: "domain" | "slug" | null;
  tenant: {
    billingEmail: string | null;
    id: string;
    name: string;
    organizationType: string | null;
    plan: string;
    slug: string;
    themeConfig: ThemeConfig;
  } | null;
  tenantSlug: string | null;
};

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-salina-server-client": "tenant-resolution",
      },
    },
  });
}

function isInvalidRefreshTokenError(error: unknown) {
  const message =
    typeof error === "string"
      ? error.toLowerCase()
      : error && typeof error === "object" && "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ? (error as { message: string }).message.toLowerCase()
        : "";

  return (
    message.includes("invalid refresh token") ||
    message.includes("refresh token not found")
  );
}

export async function createSupabaseUserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Ignore cookie writes when Next.js disallows mutation in the current render path.
        }
      },
    },
  });
}

async function getOrganizationById(tenantId: string): Promise<OrganizationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("organizations")
    .select("id, slug, name, plan, billing_email, organization_type, status, theme_config")
    .eq("id", tenantId)
    .maybeSingle<OrganizationRecord>();

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrganizationBySlug(tenantSlug: string): Promise<OrganizationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("organizations")
    .select("id, slug, name, plan, billing_email, organization_type, status, theme_config")
    .eq("slug", tenantSlug)
    .maybeSingle<OrganizationRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function getOrganizationByHost(host: string): Promise<OrganizationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("tenant_domains")
    .select("tenant_id")
    .eq("host", host)
    .maybeSingle<{ tenant_id: string }>();

  if (error) {
    throw error;
  }

  if (!data?.tenant_id) {
    return null;
  }

  return getOrganizationById(data.tenant_id);
}

export const getCurrentViewer = cache(async (): Promise<ViewerContext | null> => {
  const client = await createSupabaseUserClient();

  if (!client) {
    return null;
  }

  try {
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return null;
    }

    const claims = getAuthSessionClaims(user);
    const userMetadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? (user.user_metadata as Record<string, unknown>)
        : undefined;
    let tenantRole: string | null = null;
    let customPermissions: string[] = [];

    if (claims.tenantId) {
      const { data: membership, error: membershipError } = await client
        .from("organization_memberships")
        .select("role, organization_roles(permissions)")
        .eq("tenant_id", claims.tenantId)
        .eq("user_id", user.id)
        .maybeSingle<{ role: string; organization_roles: { permissions: string[] } | null }>();

      if (membershipError) {
        console.error("Failed to load organization membership:", membershipError);
        // Throwing here will be caught by call sites handling getCurrentViewer appropriately
        throw membershipError;
      }

      tenantRole = membership?.role ?? null;
      if (membership?.organization_roles && Array.isArray(membership.organization_roles.permissions)) {
        customPermissions = membership.organization_roles.permissions;
      }
    }

    return {
      email: user.email ?? null,
      id: user.id,
      isPlatformAdmin: claims.isPlatformAdmin,
      isTemporaryApplicant: claims.isTemporaryApplicant,
      tenantRole,
      customPermissions,
      tenantId: claims.tenantId,
      tenantSlug:
        typeof userMetadata?.tenant_slug === "string"
          ? userMetadata.tenant_slug
          : typeof user.app_metadata?.tenant_slug === "string"
            ? user.app_metadata.tenant_slug
            : null,
    };
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      return null;
    }

    throw error;
  }
});

export const resolveCurrentTenant = cache(async (): Promise<TenantContext> => {
  const { host, tenantSlug } = await getTenantRequestContext();
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!hasSupabaseEnv) {
    return {
      host,
      resolutionError: null,
      resolvedBy: null,
      tenant: null,
      tenantSlug,
    };
  }

  try {
    if (tenantSlug) {
      const tenant = await getOrganizationBySlug(tenantSlug);

      if (tenant) {
        if (tenant.status === "suspended") {
          throw new Error("This organization has been suspended.");
        }

        return {
          host,
          resolutionError: null,
          resolvedBy: "slug",
          tenant: {
            billingEmail: tenant.billing_email,
            id: tenant.id,
            name: tenant.name,
            organizationType: tenant.organization_type,
            plan: tenant.plan,
            slug: tenant.slug,
            themeConfig: tenant.theme_config,
          },
          tenantSlug,
        };
      }
    }

    if (host) {
      const tenant = await getOrganizationByHost(host);

      if (tenant) {
        if (tenant.status === "suspended") {
          throw new Error("This organization has been suspended.");
        }

        return {
          host,
          resolutionError: null,
          resolvedBy: tenantSlug ? "slug" : "domain",
          tenant: {
            billingEmail: tenant.billing_email,
            id: tenant.id,
            name: tenant.name,
            organizationType: tenant.organization_type,
            plan: tenant.plan,
            slug: tenant.slug,
            themeConfig: tenant.theme_config,
          },
          tenantSlug,
        };
      }
    }
  } catch (error) {
    return {
      host,
      resolutionError:
        error instanceof Error ? error.message : "Tenant resolution failed.",
      resolvedBy: null,
      tenant: null,
      tenantSlug,
    };
  }

  return {
    host,
    resolutionError: null,
    resolvedBy: null,
    tenant: null,
    tenantSlug,
  };
});