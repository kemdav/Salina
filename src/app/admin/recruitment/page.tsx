import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { RecruitmentList } from "@/components/organisms/recruitment-list";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { redirect } from "next/navigation";

export default async function RecruitmentIndexPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const adminClient = createSupabaseAdminClient("recruitment-list");

  if (!tenant || !adminClient || !canManageTemporaryApplicants(viewer)) {
    redirect("/admin/dashboard");
  }

  const { data: entries, error } = await adminClient
    .from("recruitment_entries")
    .select("id, title, description, status, created_at")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return <RecruitmentList entries={entries || []} />;
}
