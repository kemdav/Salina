"use server";

import { revalidatePath } from "next/cache";
import { createUserClient } from "@/lib/supabase/user-server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Organization {
  id: string;
  slug: string;
  name: string;
  plan: string;
  status: "pending" | "active" | "suspended";
  created_at: string;
  updated_at: string;
}

export async function verifyPlatformAdmin(client: SupabaseClient) {
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const appMetadata = user.app_metadata || {};
  const isPlatformAdmin =
    appMetadata.role === "system_admin" ||
    (Array.isArray(appMetadata.roles) && appMetadata.roles.includes("system_admin"));

  if (!isPlatformAdmin) {
    throw new Error("Unauthorized: Requires platform admin privileges.");
  }
}

export async function getOrganizations(): Promise<Organization[]> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyPlatformAdmin(client);

  const { data, error } = await client
    .from("organizations")
    .select(`
      id,
      slug,
      name,
      plan,
      status,
      created_at,
      updated_at
    `)
    .neq("slug", "salina")
    .neq("slug", "system-admin")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch organizations: ${error.message}`);
  }

  return data as Organization[];
}

export async function updateOrganizationStatus(
  id: string,
  newStatus: "pending" | "active" | "suspended"
): Promise<Organization> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyPlatformAdmin(client);

  const { data, error } = await client
    .from("organizations")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update organization status: ${error.message}`);
  }

  revalidatePath("/superadmin/organizations");
  return data as Organization;
}
