import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SelfInitiateApplicationForm } from "./client";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ role: string; entryId: string }>;
}) {
  const { role: tenantSlug, entryId } = await params;
  const adminClient = createSupabaseAdminClient("tenant-apply-view");

  if (!adminClient) {
    return notFound();
  }

  // Find tenant
  const { data: tenant, error: tenantErr } = await adminClient
    .from("organizations")
    .select("id")
    .eq("slug", tenantSlug)
    .single();

  if (tenantErr || !tenant) {
    return notFound();
  }

  // Find published recruitment entry
  const { data: entry, error: entryErr } = await adminClient
    .from("recruitment_entries")
    .select("title, description, status")
    .eq("id", entryId)
    .eq("tenant_id", tenant.id)
    .single();

  if (entryErr || !entry || entry.status !== "published") {
    return (
      <div className="mx-auto max-w-xl py-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Application Closed</h1>
        <p className="mt-4 text-slate-600">
          This recruitment cycle is not currently accepting applications.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SelfInitiateApplicationForm 
        tenantSlug={tenantSlug} 
        entryId={entryId} 
        entryTitle={entry.title}
        entryDescription={entry.description}
      />
    </div>
  );
}
