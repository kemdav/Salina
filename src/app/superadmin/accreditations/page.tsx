import { createClient } from "@supabase/supabase-js";
import { AccreditationReviewWorkspace } from "@/components/organisms/accreditation-review-workspace";

export default async function AccreditationsPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: organizations } = await adminClient
    .from("organizations")
    .select("id, name, organization_type, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

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
