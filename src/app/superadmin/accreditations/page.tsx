import { createClient } from "@supabase/supabase-js";
import { AccreditationReviewWorkspace } from "@/components/organisms/accreditation-review-workspace";

export const dynamic = "force-dynamic";

export default async function AccreditationsPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Accreditation review is unavailable because the Supabase server
        configuration is missing.
      </div>
    );
  }

  const adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: organizations, error } = await adminClient
    .from("organizations")
    .select("id, name, organization_type, created_at")
    .eq("status", "pending")
    .neq("slug", "salina")
    .neq("slug", "system-admin") // exclude the root platform admin tenant
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch pending organizations:", error);
    return (
      <div className="p-6 text-sm text-destructive">
        An error occurred while loading pending accreditations. Please check
        server logs.
      </div>
    );
  }

  // Map to the format expected by AccreditationReviewWorkspace
  const mappedOrgs = (organizations || []).map((org) => ({
    id: org.id,
    name: org.name,
    type: org.organization_type || "Unknown Type",
    priority: "STANDARD", // Can be dynamic if needed
    time: new Date(org.created_at).toLocaleDateString(), // Basic formatting
  }));

  return <AccreditationReviewWorkspace initialOrgs={mappedOrgs} />;
}
