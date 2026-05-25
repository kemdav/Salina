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

export async function approveApplication(requestId: string) {
  const userClient = await createUserClient();
  if (!userClient) return { ok: false, error: "Unauthorized" };

  try {
    await verifyPlatformAdmin(userClient);
  } catch {
    return { ok: false, error: "Unauthorized: Requires platform admin privileges." };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return { ok: false, error: "Server configuration error" };

  // 1. Mark request as approved
  const { data: request, error: updateReqError } = await adminClient
    .from("accreditation_requests")
    .update({ status: "approved" })
    .eq("id", requestId)
    .eq("status", "pending")
    .select()
    .single();

  if (updateReqError || !request) {
    return { ok: false, error: "Failed to approve: Request not found or no longer pending" };
  }

  // 2. Provision the organization
  const { data: organization, error: orgError } = await adminClient
    .from("organizations")
    .insert({
      billing_email: request.contact_email,
      name: request.org_name,
      organization_type: request.org_type,
      plan: "standard",
      slug: request.org_slug,
      status: "active",
      theme_config: {},
    })
    .select("id")
    .single();

  if (orgError || !organization) {
    await adminClient
      .from("accreditation_requests")
      .update({ status: "pending" })
      .eq("id", requestId);
    return { ok: false, error: "Failed to create organization" };
  }

  // 3. Make user the owner
  const { error: membershipError } = await adminClient.from("organization_memberships").insert({
    role: "owner",
    tenant_id: organization.id,
    user_id: request.user_id,
  });

  if (membershipError) {
    await adminClient.from("organizations").delete().eq("id", organization.id);
    await adminClient
      .from("accreditation_requests")
      .update({ status: "pending" })
      .eq("id", requestId);
    return { ok: false, error: "Failed to assign organization owner" };
  }

  // 4. Update user metadata
  const { data: userRecord } = await adminClient.auth.admin.getUserById(request.user_id);
  if (userRecord?.user) {
    const user = userRecord.user;
    const currentAppMetadata = typeof user.app_metadata === "object" ? user.app_metadata : {};
    const currentUserMetadata = typeof user.user_metadata === "object" ? user.user_metadata : {};

    await adminClient.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...currentAppMetadata,
        tenant_id: organization.id,
        tenant_slug: request.org_slug,
        has_pending_request: false,
      },
      user_metadata: {
        ...currentUserMetadata,
        tenant_id: organization.id,
        tenant_slug: request.org_slug,
      },
    });
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}

export async function rejectApplication(requestId: string) {
  const userClient = await createUserClient();
  if (!userClient) return { ok: false, error: "Unauthorized" };

  try {
    await verifyPlatformAdmin(userClient);
  } catch {
    return { ok: false, error: "Unauthorized: Requires platform admin privileges." };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return { ok: false, error: "Server configuration error" };

  const { error } = await adminClient
    .from("accreditation_requests")
    .update({ status: "rejected" })
    .eq("id", requestId)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    return { ok: false, error: "Failed to reject: Request not found or no longer pending" };
  }

  revalidatePath("/superadmin/accreditations");
  return { ok: true };
}
