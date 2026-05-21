import {
  resolveCurrentTenant,
  getCurrentViewer,
  createSupabaseUserClient,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { canManageTemporaryApplicants } from "@/lib/organization-permissions";
import { RecruitmentSettingsEditor } from "./client";

export default async function RecruitmentSettingsPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();
  const { entryId } = await params;

  if (
    !tenant ||
    !userClient ||
    !viewer ||
    !canManageTemporaryApplicants(viewer)
  ) {
    redirect("/admin/dashboard");
  }

  const { data: entry, error } = await userClient
    .from("recruitment_entries")
    .select("id, title, settings")
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .single();

  if (error || !entry) {
    redirect("/admin/recruitment");
  }

  // Ensure settings is at least an empty stages array
  const settings = entry.settings && typeof entry.settings === "object"
    ? entry.settings
    : { stages: [] };

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8" style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Settings: {entry.title}
        </h1>
        <p className="mt-2 text-slate-600">Customize the pipeline stages and forms for this recruitment cycle.</p>
      </div>

      <RecruitmentSettingsEditor entryId={entry.id} initialSettings={settings} />
    </div>
  );
}
