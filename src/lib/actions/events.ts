"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { canManageEvents } from "@/lib/organization-permissions";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  start_time: z.string(),
  end_time: z.string(),
});

export async function createEvent(rawInput: unknown) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer || !canManageEvents(viewer)) {
    throw new Error("You do not have permission to manage events.");
  }

  const input = createEventSchema.parse(rawInput);

  const { data, error } = await userClient
    .from("events")
    .insert({
      tenant_id: tenant.id,
      title: input.title,
      description: input.description,
      location: input.location,
      start_time: input.start_time,
      end_time: input.end_time,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/${tenant.slug}/admin/events`);
  revalidatePath(`/${tenant.slug}/officer/events`);
  revalidatePath(`/${tenant.slug}/member/events`);
  return data;
}

export async function deleteEvent(eventId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer || !canManageEvents(viewer)) {
    throw new Error("You do not have permission to manage events.");
  }

  const { error } = await userClient
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("tenant_id", tenant.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/${tenant.slug}/admin/events`);
  revalidatePath(`/${tenant.slug}/officer/events`);
  revalidatePath(`/${tenant.slug}/member/events`);
  return true;
}

export async function getEvents() {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient) return [];

  const { data, error } = await userClient
    .from("events")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}
