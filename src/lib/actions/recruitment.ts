
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

  // 1. Fetch current settings to see what stages exist right now
  const { data: currentEntry, error: entryErr } = await userClient
    .from("recruitment_entries")
    .select("settings")
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .single();

  if (entryErr || !currentEntry) {
    throw new Error("Recruitment cycle not found.");
  }

  const currentSettings = currentEntry.settings as { stages?: { id: string; name: string }[] } | null;
  const currentStages = currentSettings?.stages || [];

  // 2. Fetch all temporary applicants to count their current stage assignment
  const { data: applicants, error: appErr } = await userClient
    .from("temporary_applicants")
    .select("id, application_data")
    .eq("recruitment_entry_id", entryId)
    .eq("tenant_id", tenant.id);

  if (appErr) {
    throw new Error(`Failed to fetch applicants: ${appErr.message}`);
  }

  const currentInitialStageId = currentStages.length > 0 ? currentStages[0].id : "application";
  const stageCounts: Record<string, number> = {};
  if (applicants) {
    for (const app of applicants) {
      const stageId = (app.application_data as { stage?: string })?.stage || currentInitialStageId;
      stageCounts[stageId] = (stageCounts[stageId] || 0) + 1;
    }
  }

  // 3. Find if any stage is deleted in the new settings, and if that stage has applicants
  const newStages = (settings as { stages?: { id: string }[] })?.stages || [];
  const newStageIds = new Set(newStages.map((s) => s.id));

  for (const currentStage of currentStages) {
    if (!newStageIds.has(currentStage.id)) {
      const count = stageCounts[currentStage.id] || 0;
      if (count > 0) {
        throw new Error(
          `Cannot delete stage "${currentStage.name}" because there are still ${count} applicant(s) assigned to it. Please transfer them to another stage first.`
        );
      }
    }
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
  
  // Fetch current data
  const { data: current, error: fetchErr } = await userClient
    .from("temporary_applicants")
    .select("application_data, recruitment_entry_id")
    .eq("id", applicantId)
    .eq("tenant_id", tenant.id)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  let validStages = ["application", "screening", "interview", "deliberation"];
  
  if (current.recruitment_entry_id) {
    const { data: entryData } = await userClient
      .from("recruitment_entries")
      .select("settings")
      .eq("id", current.recruitment_entry_id)
      .single();
      
    const settingsStages = (entryData?.settings as { stages?: { id: string }[] })?.stages;
    if (Array.isArray(settingsStages) && settingsStages.length > 0) {
      validStages = settingsStages.map(s => s.id);
    }
  }

  if (!validStages.includes(stage)) {
    throw new Error(`Invalid stage: ${stage}. Valid stages are: ${validStages.join(", ")}`);
  }

  const parsedStage = stage;

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
