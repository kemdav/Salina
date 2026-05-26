"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";

import { canAssignTemporaryRoles } from "@/lib/organization-permissions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  createSupabaseUserClient,
  getCurrentViewer,
  resolveCurrentTenant,
} from "@/lib/supabase/server";

export type Status = "Active" | "Probation" | "Alumni" | "Suspended";
export type Dues = "Paid" | "Unpaid";

const ALLOWED_MEMBERSHIP_ROLES = new Set([
  "owner",
  "admin",
  "officer",
  "member",
  "viewer",
]);

export interface Member {
  id: string;
  membership_id: string;
  tenant_id: string;
  userId: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  roleId: string | null;
  role_id: string | null;
  roleExpiresAt: string | null;
  role_expires_at: string | null;
  status: Status;
  dues: Dues;
  tags: string[];
  joinedAt: string;
  joined_at: string;
}

type MembershipRow = {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  role_id: string | null;
  role_expires_at: string | null;
  membership_status: Status | null;
  dues_status: Dues | null;
  tags: string[] | null;
  created_at: string;
};

function canManageMemberRoster(
  viewer: Awaited<ReturnType<typeof getCurrentViewer>>,
) {
  if (!viewer) {
    return false;
  }

  if (viewer.isPlatformAdmin) {
    return true;
  }

  if (viewer.customPermissions.includes("Member roster edits")) {
    return true;
  }

  return (
    viewer.tenantRole === "owner" ||
    viewer.tenantRole === "admin" ||
    viewer.tenantRole === "officer"
  );
}

async function requireRosterAccess() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !viewer || !userClient || !canManageMemberRoster(viewer)) {
    throw new Error("You do not have permission to manage members.");
  }

  return { tenant, viewer, userClient };
}

async function requireRosterReadAccess() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !viewer || !userClient || !viewer.tenantRole) {
    throw new Error("You do not have permission to view members.");
  }

  return { tenant, viewer, userClient };
}

function revalidateMemberPaths() {
  revalidatePath("/admin/members");
  revalidatePath("/officer/members");
  revalidatePath("/", "layout");
}

export async function getMembers(): Promise<Member[]> {
  const { tenant, userClient } = await requireRosterReadAccess();
  const adminClient = createSupabaseAdminClient("members-fetch");

  if (!adminClient) {
    throw new Error("Could not initialize Admin client.");
  }

  const { data, error } = await userClient
    .from("organization_memberships")
    .select(
      "id, tenant_id, user_id, role, role_id, role_expires_at, membership_status, dues_status, tags, created_at",
    )
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  const members = await Promise.all(
    (data as MembershipRow[]).map(async (membership) => {
      let name = "Unknown User";
      let email = "No email";

      if (membership.user_id) {
        const { data: userData, error: userError } =
          await adminClient.auth.admin.getUserById(membership.user_id);

        if (userError) {
          throw new Error(`Failed to load member profile: ${userError.message}`);
        }

        if (userData?.user) {
          name =
            userData.user.user_metadata?.display_name ||
            userData.user.user_metadata?.full_name ||
            userData.user.email ||
            name;
          email = userData.user.email || email;
        }
      }

      const status = membership.membership_status ?? "Active";
      const dues = membership.dues_status ?? "Unpaid";
      const tags = membership.tags ?? [];

      return {
        id: membership.id,
        membership_id: membership.id,
        tenant_id: membership.tenant_id,
        userId: membership.user_id,
        user_id: membership.user_id,
        name,
        email,
        role: membership.role,
        roleId: membership.role_id,
        role_id: membership.role_id,
        roleExpiresAt: membership.role_expires_at,
        role_expires_at: membership.role_expires_at,
        status,
        dues,
        tags,
        joinedAt: membership.created_at,
        joined_at: membership.created_at,
      };
    }),
  );

  return members;
}

export async function updateMemberStatus(membershipId: string, status: Status) {
  const { tenant, userClient } = await requireRosterAccess();

  const { error } = await userClient
    .from("organization_memberships")
    .update({ membership_status: status })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }

  revalidateMemberPaths();
}

export async function updateMemberDues(membershipId: string, dues: Dues) {
  const { tenant, userClient } = await requireRosterAccess();

  const { error } = await userClient
    .from("organization_memberships")
    .update({ dues_status: dues })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(`Failed to update dues: ${error.message}`);
  }

  revalidateMemberPaths();
}

function generateSecurePassword() {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const num = "0123456789";
  const sym = "!@#$%^&*()_+";
  const all = lower + upper + num + sym;

  const passwordChars = [
    lower[randomInt(lower.length)],
    upper[randomInt(upper.length)],
    num[randomInt(num.length)],
    sym[randomInt(sym.length)],
  ];

  for (let i = 0; i < 10; i += 1) {
    passwordChars.push(all[randomInt(all.length)]);
  }

  for (let i = passwordChars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

export async function inviteMember(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const name = formData.get("name")?.toString().trim();
  const role = (formData.get("role")?.toString().trim().toLowerCase() ||
    "member") as string;

  if (!email || !name) {
    throw new Error("Email and Name are required.");
  }

  if (!ALLOWED_MEMBERSHIP_ROLES.has(role)) {
    throw new Error("Invalid membership role.");
  }

  const { tenant } = await requireRosterAccess();
  const adminClient = createSupabaseAdminClient("invite-member");

  if (!adminClient) {
    throw new Error("Could not initialize Admin client.");
  }

  const tempPassword = generateSecurePassword();

  const { data: userResponse, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        display_name: name,
        tenant_slug: tenant.slug,
        tenant_id: tenant.id,
      },
      app_metadata: {
        tenant_id: tenant.id,
        tenant_slug: tenant.slug,
      },
    });

  if (createError) {
    throw new Error(`Failed to create user: ${createError.message}`);
  }

  const userId = userResponse.user.id;

  const { error: membershipError } = await adminClient
    .from("organization_memberships")
    .insert({
      tenant_id: tenant.id,
      user_id: userId,
      role,
      membership_status: "Active",
      dues_status: "Unpaid",
    });

  if (membershipError) {
    await adminClient.auth.admin.deleteUser(userId);

    if (membershipError.code === "23505") {
      throw new Error("Member already exists.");
    }

    throw new Error(`Failed to add membership: ${membershipError.message}`);
  }

  revalidateMemberPaths();

  return tempPassword;
}

export async function removeMember(membershipId: string, userId: string) {
  const { tenant, userClient } = await requireRosterAccess();

  const { data: membership, error: membershipError } = await userClient
    .from("organization_memberships")
    .select("user_id")
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id)
    .maybeSingle<{ user_id: string }>();

  if (membershipError) {
    throw new Error(`Failed to verify membership: ${membershipError.message}`);
  }

  if (!membership || membership.user_id !== userId) {
    throw new Error("Member identity mismatch for removal request.");
  }

  const { error } = await userClient
    .from("organization_memberships")
    .delete()
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(`Failed to remove member: ${error.message}`);
  }

  const adminClient = createSupabaseAdminClient("remove-member");

  if (adminClient) {
    const { data: userData, error: readUserError } =
      await adminClient.auth.admin.getUserById(userId);

    if (readUserError) {
      throw new Error(`Failed to load user metadata: ${readUserError.message}`);
    }

    if (userData?.user) {
      const appMetadata = userData.user.app_metadata || {};

      if (appMetadata.tenant_id === tenant.id) {
        const { error: updateUserError } = await adminClient.auth.admin.updateUserById(
          userId,
          {
            app_metadata: {
              ...appMetadata,
              tenant_id: null,
              tenant_slug: null,
            },
          },
        );

        if (updateUserError) {
          throw new Error(`Failed to clear tenant metadata: ${updateUserError.message}`);
        }
      }
    }
  }

  revalidateMemberPaths();
}

export async function updateMemberRole(membershipId: string, role: string) {
  const normalizedRole = role.trim().toLowerCase();

  if (!ALLOWED_MEMBERSHIP_ROLES.has(normalizedRole)) {
    throw new Error("Invalid membership role.");
  }

  const { tenant, userClient } = await requireRosterAccess();

  const { error } = await userClient
    .from("organization_memberships")
    .update({ role: normalizedRole })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }

  revalidateMemberPaths();
}

export async function updateMemberTags(membershipId: string, tags: string[]) {
  const { tenant, userClient } = await requireRosterAccess();

  const cleanTags = tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);

  const { error } = await userClient
    .from("organization_memberships")
    .update({ tags: cleanTags })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(`Failed to update tags: ${error.message}`);
  }

  revalidateMemberPaths();
}

export async function updateMemberName(userId: string, newName: string) {
  const trimmedName = newName.trim();

  if (!trimmedName) {
    throw new Error("Member name is required.");
  }

  const { tenant, userClient } = await requireRosterAccess();

  const { data: membership, error: membershipError } = await userClient
    .from("organization_memberships")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`Failed to verify member: ${membershipError.message}`);
  }

  if (!membership) {
    throw new Error("User is not a member of the active tenant.");
  }

  const adminClient = createSupabaseAdminClient("update-member-name");

  if (!adminClient) {
    throw new Error("Could not initialize Admin client.");
  }

  const { data: userData, error: readUserError } =
    await adminClient.auth.admin.getUserById(userId);

  if (readUserError) {
    throw new Error(`Failed to load user: ${readUserError.message}`);
  }

  if (!userData?.user) {
    throw new Error("User not found.");
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...userData.user.user_metadata,
      full_name: trimmedName,
      display_name: trimmedName,
    },
  });

  if (error) {
    throw new Error(`Failed to update member name: ${error.message}`);
  }

  revalidateMemberPaths();
}

export async function assignCustomRole(
  membershipId: string,
  roleId: string | null,
  expiresAt?: string | null,
) {
  const { tenant, viewer, userClient } = await requireRosterAccess();

  if (!canAssignTemporaryRoles(viewer)) {
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

  revalidateMemberPaths();
}

export async function updateSystemRole(membershipId: string, newRole: string) {
  const { tenant, viewer, userClient } = await requireRosterAccess();

  const isAdmin =
    viewer.isPlatformAdmin ||
    ["admin", "owner", "system_admin"].includes(viewer.tenantRole || "");

  if (!isAdmin) {
    throw new Error("You do not have permission to update system roles.");
  }

  if (!["member", "officer"].includes(newRole)) {
    throw new Error(
      "Invalid system role. Can only assign member or officer roles through this interface.",
    );
  }

  const { error } = await userClient
    .from("organization_memberships")
    .update({ role: newRole })
    .eq("id", membershipId)
    .eq("tenant_id", tenant.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMemberPaths();
}
