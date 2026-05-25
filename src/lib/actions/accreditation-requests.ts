"use server";

import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";

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

const submitAccreditationSchema = z
  .object({
    billingEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid contact email address."),
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

export type SubmitAccreditationInput = z.input<typeof submitAccreditationSchema>;

export type SubmitAccreditationResult =
  | { ok: true }
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
        "x-salina-server-client": "accreditation-request",
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

function getErrorMessage(error: unknown): string {
  if (isPostgrestError(error) && error.code === "23505") {
    return "That organization slug is already requested by someone else.";
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Accreditation request failed.";
}

export async function submitAccreditationRequest(
  input: SubmitAccreditationInput
): Promise<SubmitAccreditationResult> {
  const validationResult = submitAccreditationSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      error:
        validationResult.error.issues[0]?.message ??
        "Invalid application details.",
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
        error: "You must be signed in to apply.",
        ok: false,
      };
    }

    const { billingEmail, name, organizationType, slug } = validationResult.data;

    // Check if slug exists in organizations
    const { data: existingOrg, error: orgCheckError } = await client
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (orgCheckError) {
      throw orgCheckError;
    }

    if (existingOrg) {
      return {
        error: "That organization slug is already in use by an active organization.",
        ok: false,
      };
    }

    const { error: insertError } = await client
      .from("accreditation_requests")
      .insert({
        user_id: user.id,
        contact_email: billingEmail,
        org_name: name,
        org_type: organizationType,
        org_slug: slug,
        status: "pending",
      });

    if (insertError) {
      throw insertError;
    }

    // Assign a temporary app_metadata role so they can bypass the login gate if needed, 
    // or we can just let /onboarding check if they have a request.
    const currentAppMetadata =
      user.app_metadata && typeof user.app_metadata === "object"
        ? (user.app_metadata as Record<string, unknown>)
        : {};
        
    await client.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...currentAppMetadata,
        has_pending_request: true,
      },
    });

    return { ok: true };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      ok: false,
    };
  }
}

export async function getUserPendingRequest() {
  const userClient = await createUserClient();
  if (!userClient) return null;
  
  const { data: { user } } = await userClient.auth.getUser();
  
  if (!user) return null;
  
  const client = createSupabaseAdminClient();
  if (!client) return null;
  
  const { data } = await client
    .from("accreditation_requests")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["pending", "rejected"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
    
  return data;
}
