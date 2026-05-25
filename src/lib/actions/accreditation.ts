"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { createUserClient } from "@/lib/supabase/user-server";

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
        "x-salina-server-client": "accreditation-admin",
      },
    },
  });
}

export async function approveApplication(orgId: string) {
  const userClient = await createUserClient();
  if (!userClient) {
    return { ok: false, error: "Unauthorized" };
  }
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Unauthorized" };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { ok: false, error: "Server configuration error" };
  }

  // Optionally verify if user is super admin here, but typically super admins are checked via RLS or logic
  // Update organization status to active
  const { error } = await adminClient
    .from("organizations")
    .update({ status: "active" })
    .eq("id", orgId)
    .eq("status", "pending");

  if (error) {
    console.error("Failed to approve application:", error);
    return { ok: false, error: "Failed to approve application" };
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}

export async function rejectApplication(orgId: string) {
  const userClient = await createUserClient();
  if (!userClient) {
    return { ok: false, error: "Unauthorized" };
  }
  const { data: { user }, error: authError } = await userClient.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "Unauthorized" };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { ok: false, error: "Server configuration error" };
  }

  const { error } = await adminClient
    .from("organizations")
    .update({ status: "rejected" })
    .eq("id", orgId)
    .eq("status", "pending");

  if (error) {
    console.error("Failed to reject application:", error);
    return { ok: false, error: "Failed to reject application" };
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}
