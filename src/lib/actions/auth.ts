"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  AUTH_PASSWORD_HELP_TEXT,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_PASSWORD_REQUIREMENTS_PATTERN,
  getAuthSessionClaims,
} from "@/lib/auth-policy";
import { LOCAL_COOKIE_DOMAIN } from "@/lib/host-routing";
import { getTenantAppUrl } from "@/lib/root-domain";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createUserClient } from "@/lib/supabase/user-server";

// 1. Zod schema validates email format and a non-empty password at the server boundary
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    confirmPassword: z.string().min(1, "Please confirm your password."),
    email: z.string().trim().email("Enter a valid email address."),
    inviteToken: z.string().uuid().optional(),
    fullName: z.string().trim().min(1, "Full name is required."),
    password: z
      .string()
      .min(
        AUTH_PASSWORD_MIN_LENGTH,
        `Minimum ${AUTH_PASSWORD_MIN_LENGTH} characters.`
      )
      .regex(AUTH_PASSWORD_REQUIREMENTS_PATTERN, AUTH_PASSWORD_HELP_TEXT),
  })
  .superRefine((value, ctx) => {
    if (value.confirmPassword !== value.password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type LoginActionState = {
  email: string;
  error: string;
};

export type SignUpActionState = {
  errors: {
    confirmPassword?: string;
    email?: string;
    fullName?: string;
    password?: string;
  };
  fields: {
    email: string;
    fullName: string;
  };
  formError?: string;
  formNotice?: string;
};

const INITIAL_LOGIN_ERROR = "";

function getCurrentAppMetadata(user: { app_metadata?: unknown }) {
  return user.app_metadata && typeof user.app_metadata === "object"
    ? (user.app_metadata as Record<string, unknown>)
    : {};
}

function getCurrentUserMetadata(user: { user_metadata?: unknown }) {
  return user.user_metadata && typeof user.user_metadata === "object"
    ? (user.user_metadata as Record<string, unknown>)
    : {};
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
  const supabase = await createUserClient(LOCAL_COOKIE_DOMAIN); // Keep local auth cookies shared across salina.localhost subdomains.

  if (!supabase) {
    return { error: "Supabase auth environment is not configured." };
  }

  // 3. Call Supabase Auth, write the session cookie inherently via our cookieStore override
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    return { error: error?.message || "Invalid credentials" };
  }

  // 4. Inspect the signed-in claims to determine the landing path.
  const { isPlatformAdmin, isTemporaryApplicant, tenantId } = getAuthSessionClaims(
    data.user,
  );

  if (isPlatformAdmin) {
    redirect("/superadmin");
  }

  if (!tenantId) {
    redirect("/onboarding");
  }

  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("slug")
    .eq("id", tenantId)
    .single();

  if (orgError || !orgData) {
    await supabase.auth.signOut();
    return { error: "Organization record not located." };
  }

  if (isTemporaryApplicant) {
    redirect(`${await getTenantAppUrl(orgData.slug)}/member/applications`);
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

  // Navigate user securely into their scoped domain subdomain shell
  redirect(await getTenantAppUrl(orgData.slug));
}

export async function signInAction(
  _previousState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const result = await signIn(email, password);

  return {
    email,
    error: result?.error ?? INITIAL_LOGIN_ERROR,
  };
}

export async function signUpAction(
  _previousState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const values = {
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    inviteToken: (() => {
      const rawInviteToken = String(formData.get("inviteToken") ?? "").trim();

      return rawInviteToken ? rawInviteToken : undefined;
    })(),
    fullName: String(formData.get("fullName") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      errors: {
        confirmPassword: fieldErrors.confirmPassword?.[0],
        email: fieldErrors.email?.[0],
        fullName: fieldErrors.fullName?.[0],
        password: fieldErrors.password?.[0],
      },
      fields: {
        email: values.email,
        fullName: values.fullName,
      },
      formError: undefined,
    };
  }

  const supabase = await createUserClient(LOCAL_COOKIE_DOMAIN); // Keep local auth cookies shared across salina.localhost subdomains.
  const adminClient = createSupabaseAdminClient("auth-sign-up");

  if (!supabase) {
    return {
      errors: {
      },
      fields: {
        email: values.email,
        fullName: values.fullName,
      },
      formError: "Supabase auth environment is not configured.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error || !data.user) {
    return {
      errors: {
      },
      fields: {
        email: values.email,
        fullName: values.fullName,
      },
      formError: error?.message ?? "Unable to create your account.",
    };
  }

  if (parsed.data.inviteToken) {
    if (!adminClient) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: "Temporary applicant invitations are unavailable right now.",
      };
    }

    const { data: temporaryApplicant, error: temporaryApplicantError } = await adminClient
      .from("temporary_applicants")
      .select("id, tenant_id, applicant_email, applicant_name, invite_token")
      .eq("invite_token", parsed.data.inviteToken)
      .eq("applicant_email", parsed.data.email)
      .maybeSingle<{ id: string; tenant_id: string; applicant_email: string; applicant_name: string; invite_token: string }>();

    if (temporaryApplicantError) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: temporaryApplicantError.message,
      };
    }

    if (!temporaryApplicant) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: "That temporary applicant invitation is invalid or expired.",
      };
    }

    if (temporaryApplicant.applicant_name.trim().toLowerCase() !== parsed.data.fullName.trim().toLowerCase()) {
      return {
        errors: {
          fullName: "Name does not match the invitation.",
        },
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: undefined,
      };
    }

    const { data: tenant, error: tenantError } = await adminClient
      .from("organizations")
      .select("slug")
      .eq("id", temporaryApplicant.tenant_id)
      .single<{ slug: string }>();

    if (tenantError || !tenant) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: tenantError?.message ?? "Unable to resolve the temporary applicant organization.",
      };
    }

    const currentAppMetadata = getCurrentAppMetadata(data.user);
    const currentUserMetadata = getCurrentUserMetadata(data.user);

    const { error: metadataError } = await adminClient.auth.admin.updateUserById(
      data.user.id,
      {
        app_metadata: {
          ...currentAppMetadata,
          tenant_id: temporaryApplicant.tenant_id,
          tenant_slug: tenant.slug,
          temporary_applicant: true,
          temporary_applicant_id: temporaryApplicant.id,
        },
        user_metadata: {
          ...currentUserMetadata,
          full_name: parsed.data.fullName,
          tenant_id: temporaryApplicant.tenant_id,
          tenant_slug: tenant.slug,
          temporary_applicant: true,
          temporary_applicant_id: temporaryApplicant.id,
        },
      }
    );

    if (metadataError) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: metadataError.message,
      };
    }

    const { error: applicantLinkError } = await adminClient
      .from("temporary_applicants")
      .update({
        applicant_user_id: data.user.id,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", temporaryApplicant.id);

    if (applicantLinkError) {
      return {
        errors: {},
        fields: {
          email: values.email,
          fullName: values.fullName,
        },
        formError: applicantLinkError.message,
      };
    }

    if (data.session) {
      await supabase.auth.refreshSession();
      redirect(`${await getTenantAppUrl(tenant.slug)}/member/applications`);
    }

    return {
      errors: {},
      fields: {
        email: values.email,
        fullName: values.fullName,
      },
      formNotice:
        "Check your email to confirm your temporary applicant account, then sign in to continue the application.",
    };
  }

  if (!data.session) {
    return {
      errors: {},
      fields: {
        email: values.email,
        fullName: values.fullName,
      },
      formNotice:
        "Check your email to confirm your account, then sign in to continue onboarding.",
    };
  }

  redirect("/onboarding");

  return {
    errors: {},
    fields: {
      email: values.email,
      fullName: values.fullName,
    },
    formError: undefined,
  };
}

export async function signOut() {
  const supabase = await createUserClient(LOCAL_COOKIE_DOMAIN); // Keep local auth cookies shared across salina.localhost subdomains.

  if (!supabase) {
    throw new Error("Supabase auth environment is not configured.");
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}
