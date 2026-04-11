"use server";

import { cookies } from "next/headers";
import { createClient, type PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";

import { RESERVED_SUBDOMAINS } from "@/lib/reserved-subdomains";

const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SUPABASE_COOKIE_PREFIX = "sb-";
const SUPABASE_AUTH_COOKIE_SUFFIX = "-auth-token";

type AuthenticatedUserSession = {
  access_token?: string;
};

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
    name: z.string().trim().min(1, "Organization name is required."),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Organization slug is required.")
      .regex(
        ORGANIZATION_SLUG_PATTERN,
        "Slug must contain only lowercase letters, numbers, and hyphens."
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
  | { ok: true; orgId: string }
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

function getSupabaseAuthCookieName(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return null;
  }

  try {
    const hostNamespace = new URL(url).hostname.split(".")[0];

    return `${SUPABASE_COOKIE_PREFIX}${hostNamespace}${SUPABASE_AUTH_COOKIE_SUFFIX}`;
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string): string | null {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  try {
    return Buffer.from(padded, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function decodeURIComponentSafely(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function extractAccessToken(value: unknown): string | null {
  if (typeof value === "string") {
    return value.split(".").length === 3 ? value : null;
  }

  if (Array.isArray(value)) {
    return typeof value[0] === "string" ? value[0] : null;
  }

  if (typeof value !== "object" || value === null) {
    return null;
  }

  const accessToken = (value as AuthenticatedUserSession).access_token;

  return typeof accessToken === "string" ? accessToken : null;
}

function parseAccessTokenFromCookieValue(rawValue: string): string | null {
  const candidates = new Set<string>();

  candidates.add(rawValue);

  const decodedURIComponentValue = decodeURIComponentSafely(rawValue);

  if (decodedURIComponentValue) {
    candidates.add(decodedURIComponentValue);
  }

  for (const candidate of Array.from(candidates)) {
    const withoutJsonPrefix = candidate.startsWith("j:")
      ? candidate.slice(2)
      : candidate;
    const withoutQuotes = withoutJsonPrefix.replace(/^"|"$/g, "");

    candidates.add(withoutQuotes);

    if (withoutQuotes.startsWith("base64-")) {
      const decodedBase64 = decodeBase64Url(withoutQuotes.slice("base64-".length));

      if (decodedBase64) {
        candidates.add(decodedBase64);
      }
    }

    const decodedBase64 = decodeBase64Url(withoutQuotes);

    if (decodedBase64) {
      candidates.add(decodedBase64);
    }
  }

  for (const candidate of candidates) {
    const directToken = extractAccessToken(candidate);

    if (directToken) {
      return directToken;
    }

    try {
      const parsedValue = JSON.parse(candidate);
      const parsedToken = extractAccessToken(parsedValue);

      if (parsedToken) {
        return parsedToken;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function getCookieChunkIndex(cookieName: string, baseName: string): number {
  if (cookieName === baseName) {
    return 0;
  }

  const chunkIndex = Number.parseInt(cookieName.slice(baseName.length + 1), 10);

  return Number.isNaN(chunkIndex) ? Number.MAX_SAFE_INTEGER : chunkIndex + 1;
}

async function getSupabaseAccessTokenFromCookies(): Promise<string | null> {
  const authCookieName = getSupabaseAuthCookieName();

  if (!authCookieName) {
    return null;
  }

  const cookieStore = await cookies();
  const directCookie = cookieStore.get(authCookieName)?.value;

  if (directCookie) {
    return parseAccessTokenFromCookieValue(directCookie);
  }

  const chunkedCookieValue = cookieStore
    .getAll()
    .filter(({ name }) => name === authCookieName || name.startsWith(`${authCookieName}.`))
    .sort((left, right) => {
      return (
        getCookieChunkIndex(left.name, authCookieName) -
        getCookieChunkIndex(right.name, authCookieName)
      );
    })
    .map(({ value }) => value)
    .join("");

  return chunkedCookieValue
    ? parseAccessTokenFromCookieValue(chunkedCookieValue)
    : null;
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

  return "Organization provisioning failed.";
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

  if (!client) {
    return {
      error: "Supabase server environment is not configured.",
      ok: false,
    };
  }

  let organizationId: string | null = null;

  try {
    const accessToken = await getSupabaseAccessTokenFromCookies();

    if (!accessToken) {
      return {
        error: "You must be signed in to create an organization.",
        ok: false,
      };
    }

    const {
      data: { user },
      error: authError,
    } = await client.auth.getUser(accessToken);

    if (authError) {
      throw authError;
    }

    if (!user?.id) {
      return {
        error: "You must be signed in to create an organization.",
        ok: false,
      };
    }

    const { billingEmail, name, slug } = validationResult.data;
    const { data: organization, error: organizationError } = await client
      .from("organizations")
      .insert({
        billing_email: billingEmail,
        name,
        plan: "standard",
        slug,
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

    return { ok: true, orgId: organization.id };
  } catch (error) {
    if (organizationId) {
      await deleteOrganizationSilently(organizationId);
    }

    return { error: getProvisioningErrorMessage(error), ok: false };
  }
}