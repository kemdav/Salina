"use server";

import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { canManageAnnouncements } from "@/lib/organization-permissions";
import { z } from "zod";

const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().min(1),
});

export async function createAnnouncement(rawInput: unknown) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer || !canManageAnnouncements(viewer)) {
    throw new Error("You do not have permission to manage announcements.");
  }

  const input = createAnnouncementSchema.parse(rawInput);

  const { data, error } = await userClient
    .from("announcements")
    .insert({
      tenant_id: tenant.id,
      author_user_id: viewer.id,
      title: input.title,
      body: input.body,
      category: input.category,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/feed`);
  revalidatePath(`/officer/feed`);
  revalidatePath(`/member/feed`);
  return data;
}

export async function getAnnouncements() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createSupabaseAdminClient("announcements-fetch");

  if (!tenant || !userClient || !viewer || !adminClient) return [];

  const { data: announcements, error } = await userClient
    .from("announcements")
    .select(`
      *,
      announcement_acknowledgments(user_id)
    `)
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const announcementsWithAuthors = await Promise.all(
    announcements.map(async (announcement) => {
      let authorName = "Unknown User";
      let authorEmail = "";

      if (announcement.author_user_id) {
        const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(announcement.author_user_id);
        if (!userError && userData?.user) {
          authorName = userData.user.user_metadata?.full_name || userData.user.user_metadata?.display_name || userData.user.email || authorName;
          authorEmail = userData.user.email || "";
        }
      }

      const acknowledgments = announcement.announcement_acknowledgments || [];
      return {
        ...announcement,
        author: {
           id: announcement.author_user_id,
           email: authorEmail,
           raw_user_meta_data: { full_name: authorName }
        },
        acknowledgmentCount: acknowledgments.length,
        hasAcknowledged: acknowledgments.some((ack: { user_id: string }) => ack.user_id === viewer.id),
      };
    })
  );

  return announcementsWithAuthors;
}

export async function acknowledgeAnnouncement(announcementId: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer) {
    throw new Error("You must be logged in to acknowledge announcements.");
  }

  const { error } = await userClient
    .from("announcement_acknowledgments")
    .insert({
      tenant_id: tenant.id,
      announcement_id: announcementId,
      user_id: viewer.id,
    });

  if (error) {
    // If it's a unique constraint violation, it's already acknowledged
    if (error.code !== '23505') {
      throw new Error(error.message);
    }
  }

  revalidatePath(`/admin/feed`);
  revalidatePath(`/officer/feed`);
  revalidatePath(`/member/feed`);
  return true;
}
