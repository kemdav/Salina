import { resolveCurrentTenant, getCurrentViewer, createSupabaseUserClient } from "@/lib/supabase/server";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { redirect } from "next/navigation";
import { ApplicationBoard, BoardStage } from "@/components/organisms/application-board";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

export default async function OfficerRecruitmentEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = await params;
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !userClient || !viewer || !canManageTemporaryApplicants(viewer)) {
    redirect("/officer/recruitment");
  }

  const { data: entry, error: entryErr } = await userClient
    .from("recruitment_entries")
    .select("title, settings")
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .single();

  if (entryErr || !entry) {
    redirect("/officer/recruitment");
  }

  const { data: applicantsRaw, error: applicantsErr } = await userClient
    .from("temporary_applicants")
    .select(
      "id, applicant_name, applicant_email, status, created_at, application_data",
    )
    .eq("recruitment_entry_id", entryId)
    .eq("tenant_id", tenant.id);

  if (applicantsErr) {
    throw applicantsErr;
  }

  const settingsStages = (entry.settings as { stages?: BoardStage[] })?.stages || [];
  const initialStageId = settingsStages.length > 0 ? settingsStages[0].id : "application";

  const applicants = (applicantsRaw || []).map((a) => ({
    id: a.id,
    name: a.applicant_name,
    email: a.applicant_email,
    status: a.status,
    created_at: a.created_at,
    stage: (a.application_data as { stage?: string })?.stage || initialStageId,
  }));

  // Render within Officer Shell
  return (
    <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
      <ApplicationBoard entryTitle={entry.title} applicants={applicants} stages={(entry.settings as { stages?: BoardStage[] })?.stages || []} />
    </AuthenticatedShell>
  );
}
