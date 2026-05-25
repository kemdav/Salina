"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant } from "@/lib/supabase/server";
import { createUserClient } from "@/lib/supabase/user-server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Status = 'Active' | 'Probation' | 'Alumni' | 'Suspended';
export type Dues = 'Paid' | 'Unpaid';

export interface Member {
  membership_id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  status: Status;
  dues: Dues;
  tags: string[];
  joined_at: string;
  email: string;
  name: string;
}

export async function getMembers(): Promise<Member[]> {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { data, error } = await client.rpc("get_tenant_members", {
    p_tenant_id: tenant.id
  });

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  return data as Member[];
}

export async function updateMemberStatus(membershipId: string, status: Status) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { error } = await client
    .from("organization_memberships")
    .update({ membership_status: status })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(`Failed to update status: ${error.message}`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

export async function updateMemberDues(membershipId: string, dues: Dues) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { error } = await client
    .from("organization_memberships")
    .update({ dues_status: dues })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(`Failed to update dues: ${error.message}`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

function generateSecurePassword() {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const num = '0123456789';
  const sym = '!@#$%^&*()_+';
  const all = lower + upper + num + sym;
  
  let password = '';
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += num[Math.floor(Math.random() * num.length)];
  password += sym[Math.floor(Math.random() * sym.length)];
  
  for (let i = 0; i < 10; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export async function inviteMember(formData: FormData) {
  const email = formData.get("email")?.toString();
  const name = formData.get("name")?.toString();
  const role = formData.get("role")?.toString() || "member";

  if (!email || !name) throw new Error("Email and Name are required.");

  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const adminClient = createSupabaseAdminClient("invite-member");
  if (!adminClient) throw new Error("Could not initialize Admin client.");

  const tempPassword = generateSecurePassword();

  // Use Admin API to create user with a temporary password and confirmed email
  const { data: userResponse, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      display_name: name,
      tenant_slug: tenant.slug,
      tenant_id: tenant.id
    },
    app_metadata: {
      tenant_id: tenant.id,
      tenant_slug: tenant.slug,
    }
  });

  if (createError) {
    throw new Error(`Failed to create user: ${createError.message}`);
  }

  const userId = userResponse.user.id;

  // Add to organization_memberships
  const { error: membershipError } = await adminClient
    .from("organization_memberships")
    .insert({
      tenant_id: tenant.id,
      user_id: userId,
      role: role,
      membership_status: 'Active',
      dues_status: 'Unpaid'
    });

  if (membershipError) throw new Error(`Failed to add membership: Member Already Exists.`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
  
  return tempPassword;
}

export async function removeMember(membershipId: string, userId: string) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { error } = await client
    .from("organization_memberships")
    .delete()
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(`Failed to remove member: ${error.message}`);

  // Clear tenant_id from app_metadata if it matches the current tenant
  const adminClient = createSupabaseAdminClient("remove-member");
  if (adminClient) {
    const { data: userData } = await adminClient.auth.admin.getUserById(userId);
    if (userData && userData.user) {
       const appMetadata = userData.user.app_metadata || {};
       if (appMetadata.tenant_id === tenant.id) {
           await adminClient.auth.admin.updateUserById(userId, {
              app_metadata: {
                 ...appMetadata,
                 tenant_id: null,
                 tenant_slug: null
              }
           });
       }
    }
  }

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

export async function updateMemberRole(membershipId: string, role: string) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { error } = await client
    .from("organization_memberships")
    .update({ role })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(`Failed to update role: ${error.message}`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

export async function updateMemberTags(membershipId: string, tags: string[]) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");

  const { error } = await client
    .from("organization_memberships")
    .update({ tags })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(`Failed to update tags: ${error.message}`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

export async function updateMemberName(userId: string, newName: string) {
  const { tenant } = await resolveCurrentTenant();
  if (!tenant) throw new Error("Active tenant not found.");

  const adminClient = createSupabaseAdminClient("update-member");
  if (!adminClient) throw new Error("Could not initialize Admin client.");

  const { data: userData } = await adminClient.auth.admin.getUserById(userId);
  if (!userData || !userData.user) throw new Error("User not found.");

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...userData.user.user_metadata,
      full_name: newName,
      display_name: newName
    }
  });

  if (error) throw new Error(`Failed to update member name: ${error.message}`);

  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
}

