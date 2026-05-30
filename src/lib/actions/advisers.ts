"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUserClient } from "@/lib/supabase/user-server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyPlatformAdmin } from "./organizations";

export interface Adviser {
  id: string;
  tenant_id: string | null;
  user_id: string | null;
  name: string;
  email: string;
  organization_name: string | null;
  status: "invited" | "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  invite_token: string | null;
  invited_by: string | null;
  invited_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAdvisers({
  status,
  search,
  page = 1,
  limit = 10,
}: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ data: Adviser[]; count: number }> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  try {
    await verifyPlatformAdmin(client);
  } catch {
    // If not a platform admin, check if they are an adviser
    const { data: { user } } = await client.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: adviser } = await client
      .from("advisers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adviser) {
      throw new Error("Unauthorized: Requires platform admin or adviser privileges.");
    }
  }

  let query = client.from("advisers").select("*", { count: "exact" });

  if (status && status !== "All Status") {
    query = query.eq("status", status.toLowerCase());
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch advisers: ${error.message}`);
  }

  return { data: data as Adviser[], count: count || 0 };
}

export async function getApprovedAdvisers(): Promise<Adviser[]> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  const { data, error } = await client
    .from("advisers")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch approved advisers: ${error.message}`);
  }

  return data as Adviser[];
}

export async function approveAdviser(adviserId: string): Promise<Adviser> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyPlatformAdmin(client);

  const { data: { user } } = await client.auth.getUser();

  const { data, error } = await client
    .from("advisers")
    .update({ 
      status: "approved", 
      reviewed_by: user?.id, 
      reviewed_at: new Date().toISOString() 
    })
    .eq("id", adviserId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to approve adviser: ${error.message}`);
  }

  revalidatePath("/superadmin/advisers");
  return data as Adviser;
}

export async function rejectAdviser(adviserId: string): Promise<Adviser> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyPlatformAdmin(client);

  const { data: { user } } = await client.auth.getUser();

  const { data, error } = await client
    .from("advisers")
    .update({ 
      status: "rejected", 
      reviewed_by: user?.id, 
      reviewed_at: new Date().toISOString() 
    })
    .eq("id", adviserId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to reject adviser: ${error.message}`);
  }

  revalidatePath("/superadmin/advisers");
  return data as Adviser;
}

export async function inviteAdviser(name: string, email: string): Promise<string> {
  const client = await createUserClient();
  if (!client) {
    throw new Error("Could not initialize Supabase client.");
  }

  await verifyPlatformAdmin(client);

  const { data: { user } } = await client.auth.getUser();

  const { data, error } = await client
    .from("advisers")
    .insert({
      name,
      email,
      status: "invited",
      invited_by: user?.id,
    })
    .select("invite_token")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An adviser with this email has already been invited or registered.");
    }
    throw new Error(`Failed to invite adviser: ${error.message}`);
  }

  revalidatePath("/superadmin/advisers");
  return data.invite_token;
}

export type RedeemAdviserActionState = {
  error?: string;
  success?: boolean;
};

export async function redeemAdviserInviteAction(
  _prevState: RedeemAdviserActionState,
  formData: FormData
): Promise<RedeemAdviserActionState> {
  const inviteToken = String(formData.get("inviteToken") ?? "").trim();
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!inviteToken || !organizationName || !password) {
    return { error: "All fields are required." };
  }

  const adminClient = createSupabaseAdminClient("adviser-redeem");
  if (!adminClient) return { error: "Server configuration error" };

  const { data: adviser, error: findError } = await adminClient
    .from("advisers")
    .select("*")
    .eq("invite_token", inviteToken)
    .eq("status", "invited")
    .single();

  if (findError || !adviser) {
    return { error: "Invalid or expired invite token." };
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: adviser.email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: adviser.name,
    }
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Unable to create account." };
  }

  const userId = authData.user.id;

  const { error: updateError } = await adminClient
    .from("advisers")
    .update({
      user_id: userId,
      organization_name: organizationName,
      status: "pending", 
    })
    .eq("id", adviser.id);

  if (updateError) {
    return { error: "Failed to link your account to the invite." };
  }

  const supabase = await createUserClient();
  if (!supabase) return { error: "Auth client error" };

  await supabase.auth.signInWithPassword({
    email: adviser.email,
    password: password,
  });

  redirect("/");
}

export async function exportAdvisersCSV({ status, search }: { status?: string; search?: string }): Promise<string> {
  const client = await createUserClient();
  if (!client) throw new Error("Could not initialize Supabase client.");
  await verifyPlatformAdmin(client);

  let query = client.from("advisers").select("*").order("created_at", { ascending: false });

  if (status && status !== "All Status") {
    query = query.eq("status", status.toLowerCase());
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to export advisers: ${error.message}`);

  const csvRows = [
    ["ID", "Name", "Email", "Organization Name", "Status", "Created At"],
    ...(data || []).map(adviser => [
      adviser.id,
      `"${(adviser.name || "").replace(/"/g, '""')}"`,
      `"${(adviser.email || "").replace(/"/g, '""')}"`,
      `"${(adviser.organization_name || "").replace(/"/g, '""')}"`,
      adviser.status,
      adviser.created_at
    ])
  ];

  return csvRows.map(row => row.join(",")).join("\n");
}

export async function bulkReviewAdvisers(ids: string[], action: "approve" | "reject"): Promise<{ ok: boolean; error?: string }> {
  const client = await createUserClient();
  if (!client) return { ok: false, error: "Could not initialize Supabase client." };
  
  try {
    await verifyPlatformAdmin(client);
  } catch {
    return { ok: false, error: "Unauthorized" };
  }

  const { data: { user } } = await client.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const adminClient = createSupabaseAdminClient("adviser-bulk");
  if (!adminClient) return { ok: false, error: "Server error" };

  const status = action === "approve" ? "approved" : "rejected";

  const { error } = await adminClient
    .from("advisers")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .in("id", ids);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/superadmin/advisers");
  return { ok: true };
}
