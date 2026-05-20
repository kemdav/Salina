import {
  resolveCurrentTenant,
  getCurrentViewer,
  createSupabaseUserClient,
} from "@/lib/supabase/server";
import { RecruitmentList } from "@/components/organisms/recruitment-list";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { redirect } from "next/navigation";

export default async function RecruitmentIndexPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    redirect("/admin/dashboard");
  }

  const { data: entries, error } = await userClient
    .from("recruitment_entries")
    .select("id, title, description, status, created_at")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return <RecruitmentList entries={entries || []} />;
}
