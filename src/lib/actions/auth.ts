"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { LOCAL_COOKIE_DOMAIN } from "@/lib/host-routing";
import { getTenantAppUrl } from "@/lib/root-domain";
import { createUserClient } from "@/lib/supabase/user-server";

// 1. Zod schema validates email format and minimum password length at the server boundary
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z
  .object({
    confirmPassword: z.string().min(1, "Please confirm your password."),
    email: z.string().trim().email("Enter a valid email address."),
    fullName: z.string().trim().min(1, "Full name is required."),
    password: z.string().min(8, "Minimum 8 characters."),
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
};

const INITIAL_LOGIN_ERROR = "";

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
