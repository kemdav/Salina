
import { revalidatePath } from "next/cache";
import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { z } from "zod";

const createEntrySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "paused", "closed"]).default("draft"),
});

const updateEntrySchema = createEntrySchema.partial().extend({
  id: z.string().uuid(),
});

export async function createRecruitmentEntry(rawInput: unknown) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    throw new Error(
      "You do not have permission to manage recruitment entries.",
    );
  }

  const input = createEntrySchema.parse(rawInput);

  const { data, error } = await userClient
    .from("recruitment_entries")
    .insert({
      tenant_id: tenant.id,
      title: input.title,
      description: input.description,
      status: input.status,
      created_by: viewer.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/recruitment");
  revalidatePath("/officer/recruitment");
  return data;
}

export async function updateRecruitmentEntry(rawInput: unknown) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    throw new Error(
      "You do not have permission to manage recruitment entries.",
    );
  }

  const input = updateEntrySchema.parse(rawInput);
  const { id, ...rawUpdates } = input;
  const updates = Object.fromEntries(
    Object.entries(rawUpdates).filter(([, value]) => value !== undefined),
  );

  const { data, error } = await userClient
    .from("recruitment_entries")
    .update(updates)
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/recruitment");
  return data;
}

export async function updateRecruitmentSettings(entryId: string, settings: Record<string, unknown>) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    throw new Error(
      "You do not have permission to manage recruitment entries.",
    );
  }

  const { data, error } = await userClient
    .from("recruitment_entries")
    .update({ settings })
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/recruitment/${entryId}/settings`);
  revalidatePath("/admin/recruitment");
  return data;
}

export async function updateApplicantStage(applicantId: string, stage: string) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    throw new Error("You do not have permission to manage applicants.");
  }
  
  // Validation relies on the provided stage matching a configured phase ID 
  // or a fallback default phase string in the calling components.
  const parsedStage = stage;

  // Fetch current data
  const { data: current, error: fetchErr } = await userClient
    .from("temporary_applicants")
    .select("application_data")
    .eq("id", applicantId)
    .eq("tenant_id", tenant.id)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  // Update jsonb safely
  const applicationData = current.application_data && typeof current.application_data === "object" ? current.application_data : {};
  const updatedData = { ...applicationData, stage: parsedStage };

  const { data, error } = await userClient
    .from("temporary_applicants")
    .update({ application_data: updatedData })
    .eq("id", applicantId)
    .eq("tenant_id", tenant.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/recruitment");
  return data;
}

export async function updateApplicantDecision(
  applicantId: string,
  status: "approved" | "rejected",
) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    throw new Error("You do not have permission to manage applicants.");
  }

  const { data, error } = await userClient
    .from("temporary_applicants")
    .update({ status })
    .eq("id", applicantId)
    .eq("tenant_id", tenant.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/recruitment");
  return data;
}
