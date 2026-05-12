"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant } from "@/lib/supabase/server";
import { createUserClient } from "@/lib/supabase/user-server";

export interface OrganizationRole {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
}

async function verifyAdminStatus(client: any, tenantId: string) {
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await client
    .from("organization_memberships")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Unauthorized: Could not verify permissions.");
  }

  if (!["admin", "owner", "system_admin"].includes(data.role)) {
    throw new Error("Unauthorized: Requires admin privileges.");
  }
}

export async function getRoles(): Promise<OrganizationRole[]> {
  const { tenant } = await resolveCurrentTenant();
  
  if (!tenant) {
    throw new Error("Active tenant not found.");
  }

  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  const { data, error } = await client
    .from("organization_roles")
    .select(`
      id,
      tenant_id,
      name,
      description,
      permissions,
      created_at,
      updated_at,
      organization_memberships(count)
    `)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch roles: ${error.message}`);
  }

  return (data || []).map((role: any) => ({
    ...role,
    member_count: role.organization_memberships?.[0]?.count || 0,
  }));
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
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create role: ${error.message}`);
  }

  revalidatePath("/[tenantSlug]/settings/roles", "page");
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

  const updates: Record<string, any> = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.permissions !== undefined) updates.permissions = data.permissions;

  const { data: updatedRole, error } = await client
    .from("organization_roles")
    .update(updates)
    .eq("id", roleId)
    .eq("tenant_id", tenant.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  revalidatePath("/[tenantSlug]/settings/roles", "page");
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
    const { error } = await client
      .from("organization_roles")
      .delete()
      .eq("id", roleId)
      .eq("tenant_id", tenant.id);

    if (error) {
      if (error.code === "23503") { // PostgreSQL foreign_key_violation code
        throw new Error("Cannot delete role: There are still members assigned to this role.");
      }
      throw error;
    }
  } catch (error: any) {
    if (error.message.includes("Cannot delete role")) {
      throw error;
    }
    throw new Error(`Failed to delete role: ${error.message}`);
  }

  revalidatePath("/[tenantSlug]/settings/roles", "page");
}