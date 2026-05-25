"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { createUserClient } from "@/lib/supabase/user-server";
import { verifyPlatformAdmin } from "./organizations";

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

  try {
    await verifyPlatformAdmin(userClient);
  } catch (error) {
    return { ok: false, error: "Unauthorized: Requires platform admin privileges." };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { ok: false, error: "Server configuration error" };
  }

  const { error } = await adminClient
    .from("organizations")
    .update({ status: "active" })
    .eq("id", orgId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    console.error("Failed to approve application:", error);
    return { ok: false, error: "Failed to approve application: Organization not found or no longer pending" };
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}

export async function rejectApplication(orgId: string) {
  const userClient = await createUserClient();
  if (!userClient) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await verifyPlatformAdmin(userClient);
  } catch (error) {
    return { ok: false, error: "Unauthorized: Requires platform admin privileges." };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { ok: false, error: "Server configuration error" };
  }

  const { error } = await adminClient
    .from("organizations")
    .update({ status: "rejected" })
    .eq("id", orgId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    console.error("Failed to reject application:", error);
    return { ok: false, error: "Failed to reject application: Organization not found or no longer pending" };
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}
