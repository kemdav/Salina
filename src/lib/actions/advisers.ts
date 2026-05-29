"use server";

import { revalidatePath } from "next/cache";
import { createUserClient } from "@/lib/supabase/user-server";
import { verifyPlatformAdmin } from "./organizations";

export interface Adviser {
  id: string;
  tenant_id: string | null;
  user_id: string | null;
  name: string;
  email: string;
  organization_name: string;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
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

  await verifyPlatformAdmin(client);

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
