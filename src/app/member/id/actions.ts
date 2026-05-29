"use server";

import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { createSupabaseUserClient } from "@/lib/supabase/server";

export type MemberIdData = {
  name: string;
  role: string;
  idNumber: string;
  issuedOn: string;
  expiryDate: string;
  roleLevel: string;
  accessPermissions: string[];
  tenantBranding: {
    name: string;
    primaryColor: string;
    textColor: string;
    logoUrl?: string;
  };
  avatarUrl?: string;
};

export async function getMemberIdData(): Promise<MemberIdData | null> {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!tenant || !viewer) {
    return null;
  }

  const client = await createSupabaseUserClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("organization_memberships")
    .select(`
      id,
      role,
      membership_status,
      created_at,
      organization_roles (
        name,
        permissions
      ),
      digital_ids (
        id_number,
        issued_at,
        expires_at
      )
    `)
    .eq("tenant_id", tenant.id)
    .eq("user_id", viewer.id)
    .single();

  if (error || !data) {
    console.error("Failed to fetch member ID data", error);
    return null;
  }

  // Find the digital ID if array is returned
  const digitalId = Array.isArray(data.digital_ids) ? data.digital_ids[0] : data.digital_ids;
  if (!digitalId) {
     return null;
  }

  const name = viewer.displayName || viewer.email?.split("@")[0] || "Unknown User";

  const issuedOn = new Date(digitalId.issued_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const expiryDate = new Date(digitalId.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Using optional chaining because organization_roles might be an array if it's a 1-to-many relationship in PostgREST but here it should be 1-to-1 or null
  const orgRoles = Array.isArray(data.organization_roles) ? data.organization_roles[0] : data.organization_roles;
  const roleName = orgRoles?.name || data.role;
  const roleLevel = orgRoles ? "Custom Role" : (data.role === 'member' ? "Tier 1 - Member" : "Tier 2 - Officer");

  const permissions = orgRoles?.permissions && Array.isArray(orgRoles.permissions) 
    ? (orgRoles.permissions as string[]) 
    : viewer.customPermissions;

  return {
    name,
    role: roleName,
    idNumber: digitalId.id_number,
    issuedOn,
    expiryDate,
    roleLevel,
    accessPermissions: permissions,
    tenantBranding: {
      name: tenant.name,
      primaryColor: tenant.themeConfig?.primaryColor || "#c6623e",
      textColor: "#ffffff",
      logoUrl: tenant.themeConfig?.logoUrl || undefined,
    },
    avatarUrl: viewer.avatarUrl || undefined,
  };
}
