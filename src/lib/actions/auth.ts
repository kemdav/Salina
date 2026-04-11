"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// 1. Zod schema validates email format and minimum password length at the server boundary
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// A factory for the user-scoped Supabase client inside Server Actions,
// hooking directly into Next.js 16 cookies() for native HTTP session storage.
async function createUserClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "pkce",
        persistSession: true,
        detectSessionInUrl: false,
        storage: {
          getItem: (key) => cookieStore.get(key)?.value ?? null,
          setItem: (key, value) => {
            cookieStore.set(key, value, {
              path: "/",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });
          },
          removeItem: (key) => {
            cookieStore.delete(key);
          },
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
    .single();

  if (membershipError || !membership) {
    await supabase.auth.signOut(); // Revoke the session
    // Redirecting to a generic 403 route for forbidden access
    redirect("/403");
  }

  // 6. Redirect to the tenant shell
  // Note: Depending on your exact domain mapping strategy `tenant` resolves the route slug.
  // In production it uses `tenant_slug.salina.com`, locally `tenant_slug.localhost:3000`.
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("slug")
    .eq("id", tenantId)
    .single();

  if (orgError || !orgData) {
    await supabase.auth.signOut();
    return { error: "Organization record not located." };
  }

  const rootDomain = process.env.ROOT_DOMAIN || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  // Navigate user securely into their scoped domain subdomain shell
  redirect(`${protocol}://${orgData.slug}.${rootDomain}`);
}

export async function signOut() {
  const supabase = await createUserClient();
  await supabase.auth.signOut(); // Clear out session from Next.js cookies
  redirect("/login");
}
