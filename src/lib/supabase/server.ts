import "server-only";

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { getTenantRequestContext } from "@/lib/tenant";

type OrganizationRecord = {
  billing_email: string | null;
  id: string;
  name: string;
  plan: string;
  slug: string;
};

export type TenantContext = {
  host: string | null;
  resolutionError: string | null;
  resolvedBy: "domain" | "slug" | null;
  tenant: {
    billingEmail: string | null;
    id: string;
    name: string;
    plan: string;
    slug: string;
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

async function getOrganizationById(tenantId: string): Promise<OrganizationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("organizations")
    .select("id, slug, name, plan, billing_email")
    .eq("id", tenantId)
    .maybeSingle<OrganizationRecord>();

  if (error) {
    throw error;
  }

  return data;
}

async function getOrganizationBySlug(tenantSlug: string): Promise<OrganizationRecord | null> {
  const client = createSupabaseAdminClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("organizations")
    .select("id, slug, name, plan, billing_email")
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
        return {
          host,
          resolutionError: null,
          resolvedBy: "slug",
          tenant: {
            billingEmail: tenant.billing_email,
            id: tenant.id,
            name: tenant.name,
            plan: tenant.plan,
            slug: tenant.slug,
          },
          tenantSlug,
        };
      }
    }

    if (host) {
      const tenant = await getOrganizationByHost(host);

      if (tenant) {
        return {
          host,
          resolutionError: null,
          resolvedBy: tenantSlug ? "slug" : "domain",
          tenant: {
            billingEmail: tenant.billing_email,
            id: tenant.id,
            name: tenant.name,
            plan: tenant.plan,
            slug: tenant.slug,
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