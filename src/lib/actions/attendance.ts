"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canManageEvents } from "@/lib/organization-permissions";
import { z } from "zod";

export async function participateInEvent(eventId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) {
    throw new Error("You must be logged in to participate in an event.");
  }

  const { data: membership, error: membershipError } = await userClient
    .from("organization_memberships")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("user_id", viewer.id)
    .single();

  if (membershipError || !membership) {
    throw new Error("You are not a member of this organization.");
  }

  const { data: existing } = await userClient
    .from("event_attendees")
    .select("id")
    .eq("event_id", eventId)
    .eq("member_id", membership.id)
    .maybeSingle();

  if (existing) {
    throw new Error("You have already RSVP'd to this event.");
  }

  const { data, error } = await userClient
    .from("event_attendees")
    .insert({
      event_id: eventId,
      member_id: membership.id,
      status: "Pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/${tenant.slug}/admin/events`);
  revalidatePath(`/${tenant.slug}/officer/events`);
  revalidatePath(`/${tenant.slug}/member/events`);
  return data;
}

const statusSchema = z.enum(["Pending", "Verified", "Flagged", "Rejected"]);

export async function updateAttendanceStatus(attendanceId: string, rawStatus: unknown) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer || !canManageEvents(viewer)) {
    throw new Error("You do not have permission to manage attendance.");
  }

  const status = statusSchema.parse(rawStatus);

  const { data, error } = await userClient
    .from("event_attendees")
    .update({ status })
    .eq("id", attendanceId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/${tenant.slug}/admin/events`);
  revalidatePath(`/${tenant.slug}/officer/events`);
  revalidatePath(`/${tenant.slug}/member/events`);
  return data;
}

export async function getAttendanceRecords(eventId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  const adminClient = createSupabaseAdminClient("attendance-records");

  if (!tenant || !userClient || !viewer || !canManageEvents(viewer) || !adminClient) {
    throw new Error("You do not have permission to view attendance records.");
  }

  const { data, error } = await userClient
    .from("event_attendees")
    .select(`
      id,
      status,
      check_in_time,
      member_id,
      organization_memberships!inner(
        id,
        user_id
      )
    `)
    .eq("event_id", eventId);

  if (error) throw new Error(error.message);

  const records = await Promise.all(
    data.map(async (record: any) => {
      const userId = record.organization_memberships.user_id;
      let name = "Unknown Member";
      if (userId) {
        const { data: userData } = await adminClient.auth.admin.getUserById(userId);
        if (userData?.user) {
          name = userData.user.user_metadata?.full_name || userData.user.email || "Unknown Member";
        }
      }
      return {
        id: record.id,
        status: record.status,
        checkIn: new Date(record.check_in_time).toLocaleString(),
        member: name,
        memberId: record.member_id,
        eventId: eventId,
      };
    })
  );

  return records;
}
