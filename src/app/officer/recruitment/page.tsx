import { redirect } from "next/navigation";

import { RecruitmentList } from "@/components/organisms/recruitment-list";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { createSupabaseUserClient } from "@/lib/supabase/server";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

export default async function OfficerRecruitmentPage() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (!canManageTemporaryApplicants(viewer)) {
    redirect("/member/feed");
  }

  const tenantContext = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();

  if (!tenantContext.tenant || !userClient) {
    return (
      <div className="p-6 text-slate-500">Recruitment is unavailable right now.</div>
    );
  }

  const { data: entries, error } = await userClient
    .from("recruitment_entries")
    .select("id, title, description, status, created_at")
    .eq("tenant_id", tenantContext.tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <RecruitmentList entries={entries || []} isOfficer={true} />
  );
}