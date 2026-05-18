"use server";

import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";

import { getTenantAppUrl } from "@/lib/root-domain";
import { RESERVED_SUBDOMAINS } from "@/lib/reserved-subdomains";
import { createUserClient } from "@/lib/supabase/user-server";

const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ORGANIZATION_TYPES = [
  "Business / Corporation",
  "Non-Profit Organization",
  "Association / Society",
  "Academic Institution",
  "Government Agency",
  "Other",
] as const;

type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

type OrganizationInsertResult = {
  id: string;
};

const provisionOrganizationSchema = z
  .object({
    billingEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid billing email address."),
    themeConfig: z
      .object({
        fontFamily: z.string().trim().min(1).optional(),
        logoUrl: z.string().trim().url().optional().or(z.literal("")),
        primaryColor: z.string().trim().min(1).optional(),
      })
      .strict()
      .optional(),
    name: z.string().trim().min(1, "Organization name is required."),
    organizationType: z
      .string()
      .trim()
      .refine(
        (value): value is OrganizationType =>
          ORGANIZATION_TYPES.includes(value as OrganizationType),
        "Please select a valid organization type."
      ),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Organization slug is required.")
      .regex(
        ORGANIZATION_SLUG_PATTERN,
        "Slug must use only lowercase letters, numbers, and single hyphens, and cannot start or end with a hyphen."
      )
      .refine(
        (slug) => !RESERVED_SUBDOMAINS.has(slug),
        "This subdomain is reserved."
      ),
  })
  .strict();

export type ProvisionOrganizationInput = z.input<
  typeof provisionOrganizationSchema
>;

export type ProvisionOrganizationResult =
  | { ok: true; orgId: string; redirectUrl: string }
  | { ok: false; error: string };

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
        "x-salina-server-client": "organization-provisioning",
      },
    },
  });
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}

function getProvisioningErrorMessage(error: unknown): string {
  console.error("PROVISIONING ERROR:", error);
  if (isPostgrestError(error) && error.code === "23505") {
    const detail = `${error.message} ${error.details ?? ""}`.toLowerCase();

    if (detail.includes("slug")) {
      return "That organization slug is already taken.";
    }

    return "An organization with those details already exists.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `Organization provisioning failed. Error: ${JSON.stringify(error)}`;
}

async function deleteOrganizationSilently(organizationId: string) {
  const client = createSupabaseAdminClient();

  if (!client) {
    return;
  }

  await client.from("organizations").delete().eq("id", organizationId);
}

export async function provisionOrganization(
  input: ProvisionOrganizationInput
): Promise<ProvisionOrganizationResult> {
  const validationResult = provisionOrganizationSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      error:
        validationResult.error.issues[0]?.message ??
        "Invalid organization details.",
      ok: false,
    };
  }

  const client = createSupabaseAdminClient();
  const userClient = await createUserClient();

  if (!client || !userClient) {
    return {
      error: "Supabase server environment is not configured.",
      ok: false,
    };
  }

  let organizationId: string | null = null;

  try {
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!user?.id) {
      return {
        error: "You must be signed in to create an organization.",
        ok: false,
      };
    }

    const { billingEmail, name, organizationType, slug, themeConfig } = validationResult.data;
    const { data: organization, error: organizationError } = await client
      .from("organizations")
      .insert({
        billing_email: billingEmail,
        name,
        organization_type: organizationType,
        plan: "standard",
        slug,
        theme_config: themeConfig ?? {},
      })
      .select("id")
      .single<OrganizationInsertResult>();

    if (organizationError) {
      throw organizationError;
    }

    organizationId = organization.id;

    const { error: membershipError } = await client
      .from("organization_memberships")
      .insert({
        role: "owner",
        tenant_id: organization.id,
        user_id: user.id,
      });

    if (membershipError) {
      throw membershipError;
    }

    const currentAppMetadata =
      user.app_metadata && typeof user.app_metadata === "object"
        ? (user.app_metadata as Record<string, unknown>)
        : {};
    const currentUserMetadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? (user.user_metadata as Record<string, unknown>)
        : {};

    const { error: metadataError } = await client.auth.admin.updateUserById(
      user.id,
      {
        app_metadata: {
          ...currentAppMetadata,
          tenant_id: organization.id,
          tenant_slug: slug,
        },
        user_metadata: {
          ...currentUserMetadata,
          tenant_id: organization.id,
          tenant_slug: slug,
        },
      }
    );

    if (metadataError) {
      throw metadataError;
    }

    const { data: refreshedSession, error: refreshError } =
      await userClient.auth.refreshSession();

    if (refreshError || !refreshedSession.session || !refreshedSession.user) {
      throw refreshError ?? new Error("Unable to refresh the current session.");
    }

    return {
      ok: true,
      orgId: organization.id,
      redirectUrl: await getTenantAppUrl(slug),
    };
  } catch (error) {
    const errorMessage = getProvisioningErrorMessage(error);

    return {
      error: organizationId
        ? `${errorMessage} If your organization was created, please sign out and sign back in before retrying.`
        : errorMessage,
      ok: false,
    };
  }
}