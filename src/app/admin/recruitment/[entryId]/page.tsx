import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { redirect } from "next/navigation";
import { ApplicationBoard } from "@/components/organisms/application-board";

export default async function RecruitmentEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = await params;
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const adminClient = createSupabaseAdminClient("recruitment-entry");

  if (!tenant || !adminClient || !canManageTemporaryApplicants(viewer)) {
    redirect("/admin/dashboard");
  }

  // Double check entry exists
  const { data: entry, error: entryErr } = await adminClient
    .from("recruitment_entries")
    .select("title")
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .single();

  if (entryErr || !entry) {
    redirect("/admin/recruitment");
  }

  // Retrieve temporary_applicants with this entry
  const { data: applicantsRaw, error: applicantsErr } = await adminClient
    .from("temporary_applicants")
    .select(
      "id, applicant_name, applicant_email, status, created_at, application_data",
    )
    .eq("recruitment_entry_id", entryId)
    .eq("tenant_id", tenant.id);

  if (applicantsErr) {
    throw applicantsErr;
  }

  const applicants = (applicantsRaw || []).map((a) => ({
    id: a.id,
    name: a.applicant_name,
    email: a.applicant_email,
    status: a.status,
    created_at: a.created_at,
    stage: (a.application_data as { stage?: string })?.stage || "application",
  }));

  return <ApplicationBoard entryTitle={entry.title} applicants={applicants} />;
}
