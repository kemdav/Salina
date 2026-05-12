import { redirect } from "next/navigation";

import { TemporaryApplicantReviewBoard } from "@/components/organisms/temporary-applicant-review-board";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

type TemporaryApplicantQueueItem = {
  applicant_email: string;
  applicant_name: string;
  applicant_user_id: string | null;
  application_data: Record<string, unknown> | null;
  id: string;
  status: string;
  submitted_at: string | null;
};

export default async function OfficerRecruitmentPage() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (!canManageTemporaryApplicants(viewer)) {
    redirect("/member/feed");
  }

  const tenantContext = await resolveCurrentTenant();
  const adminClient = createSupabaseAdminClient("temporary-applicants-queue");

  if (!tenantContext.tenant || !adminClient) {
    return (
      <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
        <TemporaryApplicantReviewBoard
          applicants={[]}
          loadError="Temporary applicant review is unavailable right now."
        />
      </AuthenticatedShell>
    );
  }

  const { data: applicants, error } = await adminClient
    .from("temporary_applicants")
    .select(
      "id, applicant_name, applicant_email, applicant_user_id, application_data, status, submitted_at",
    )
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false })
    .returns<TemporaryApplicantQueueItem[]>();

  return (
    <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
      <TemporaryApplicantReviewBoard
        applicants={applicants ?? []}
        loadError={error?.message}
      />
    </AuthenticatedShell>
  );
}