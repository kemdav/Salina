"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { createUserClient } from "@/lib/supabase/user-server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { canAssignTemporaryRoles } from "@/lib/organization-permissions";

export interface OrganizationRole {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  permissions: string[];
  is_assignable_to_members: boolean;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: string[];
  is_assignable_to_members?: boolean;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
  permissions?: string[];
  is_assignable_to_members?: boolean;
}

async function verifyAdminStatus(client: SupabaseClient, tenantId: string) {
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const appMetadata = user.app_metadata || {};
  const isPlatformAdmin =
    appMetadata.role === "system_admin" ||
    (Array.isArray(appMetadata.roles) && appMetadata.roles.includes("system_admin"));

  if (isPlatformAdmin) {
    return;
  }

  const { data, error } = await client
    .from("organization_memberships")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Unauthorized: Could not verify permissions.");
  }

  if (!["admin", "owner", "system_admin"].includes(data.role)) {
    throw new Error("Unauthorized: Requires admin privileges or system_admin role assigned in database.");
  }
}

export async function getRoles(): Promise<OrganizationRole[]> {
  const { tenant } = await resolveCurrentTenant();
  
  if (!tenant) {
    throw new Error("Active tenant not found.");
  }

  const client = await createUserClient();
  const viewer = await getCurrentViewer();

  if (!client || !viewer) {
    throw new Error("Could not initialize Supabase client or viewer context.");
  }

  const isTenantAdmin = ["admin", "owner", "system_admin"].includes(viewer.tenantRole || "");
  const hasTempRolePermission = canAssignTemporaryRoles(viewer);

  if (!isTenantAdmin && !hasTempRolePermission) {
    throw new Error("Unauthorized: Requires admin privileges or Temporary role assignment permission.");
  }

  const { data, error } = await client
    .from("organization_roles")
    .select(`
      id,
      tenant_id,
      name,
      description,
      permissions,
      is_assignable_to_members,
      created_at,
      updated_at,
      organization_memberships(count)
    `)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch roles: ${error.message}`);
  }

  return (data || []).map((role: OrganizationRole & { organization_memberships?: { count: number }[] }) => {
    const { organization_memberships, ...cleanRole } = role;
    return {
      ...cleanRole,
      member_count: organization_memberships?.[0]?.count || 0,
    };
  });
}

export async function createRole(data: CreateRoleInput): Promise<OrganizationRole> {
  const { tenant } = await resolveCurrentTenant();
  
  if (!tenant) {
    throw new Error("Active tenant not found.");
  }

  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyAdminStatus(client, tenant.id);

  const { data: newRole, error } = await client
    .from("organization_roles")
    .insert({
      tenant_id: tenant.id,
      name: data.name,
      description: data.description || null,
      permissions: data.permissions || [],
      is_assignable_to_members: data.is_assignable_to_members ?? true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create role: ${error.message}`);
  }

  revalidatePath(`/admin/roles`);
  return newRole;
}

export async function updateRole(roleId: string, data: UpdateRoleInput): Promise<OrganizationRole> {
  const { tenant } = await resolveCurrentTenant();
  
  if (!tenant) {
    throw new Error("Active tenant not found.");
  }

  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyAdminStatus(client, tenant.id);

  const updates: Partial<UpdateRoleInput> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.permissions !== undefined) updates.permissions = data.permissions;
  if (data.is_assignable_to_members !== undefined) updates.is_assignable_to_members = data.is_assignable_to_members;

  if (Object.keys(updates).length === 0) {
    throw new Error("No role fields were provided to update.");
  }

  const { data: updatedRole, error } = await client
    .from("organization_roles")
    .update(updates)
    .eq("id", roleId)
    .eq("tenant_id", tenant.id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  if (!updatedRole) {
    throw new Error(`Role not found or you do not have permission to update it.`);
  }

  revalidatePath(`/admin/roles`);
  return updatedRole;
}

export async function deleteRole(roleId: string): Promise<void> {
  const { tenant } = await resolveCurrentTenant();
  
  if (!tenant) {
    throw new Error("Active tenant not found.");
  }

  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyAdminStatus(client, tenant.id);

  try {
    const { data: deletedRole, error } = await client
      .from("organization_roles")
      .delete()
      .eq("id", roleId)
      .eq("tenant_id", tenant.id)
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === "23503") { // PostgreSQL foreign_key_violation code
        throw new Error("Cannot delete role: There are still members assigned to this role.");
      }
       const errorMessage = error.code
         ? `${error.message} (code: ${error.code})`
         : error.message;
       throw new Error(errorMessage);
    }

    if (!deletedRole) {
      throw new Error("Role not found or you do not have permission to delete it.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("Cannot delete role")) {
        throw error;
      }
      throw new Error(`Failed to delete role: ${error.message}`);
    }
    throw new Error("Failed to delete role: Unknown error");
  }

  revalidatePath(`/admin/roles`);
}