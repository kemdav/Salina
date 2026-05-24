"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canAssignTemporaryRoles } from "@/lib/organization-permissions";

export interface Member {
  id: string; // The membership id
  userId: string;
  name: string;
  email: string;
  role: string;
  roleId: string | null;
  roleExpiresAt: string | null;
  joinedAt: string;
}

export async function getMembers(): Promise<Member[]> {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  const adminClient = createSupabaseAdminClient("members-fetch");

  if (!tenant || !userClient || !viewer || !adminClient) {
    throw new Error("You do not have permission to view members.");
  }

  const { data, error } = await userClient
    .from("organization_memberships")
    .select("id, user_id, role, role_id, role_expires_at, created_at")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const members = await Promise.all(
    data.map(async (membership) => {
      let name = "Unknown User";
      let email = "No email";
      if (membership.user_id) {
        const { data: userData } = await adminClient.auth.admin.getUserById(membership.user_id);
        if (userData?.user) {
          name = userData.user.user_metadata?.full_name || userData.user.email || name;
          email = userData.user.email || email;
        }
      }

      return {
        id: membership.id,
        userId: membership.user_id,
        name,
        email,
        role: membership.role,
        roleId: membership.role_id,
        roleExpiresAt: membership.role_expires_at,
        joinedAt: membership.created_at,
      };
    })
  );

  return members;
}

export async function assignCustomRole(membershipId: string, roleId: string | null, expiresAt?: string | null) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) {
    throw new Error("You do not have permission to assign roles.");
  }

  const hasPermission = canAssignTemporaryRoles(viewer);

  if (!hasPermission) {
    throw new Error("You do not have permission to assign custom roles.");
  }

  const updateData = { 
    role_id: roleId,
    role_expires_at: expiresAt || null,
  };

  const { error } = await userClient
    .from("organization_memberships")
    .update(updateData)
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
