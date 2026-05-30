import { createClient } from "@supabase/supabase-js";
import { AccreditationReviewWorkspace } from "@/components/organisms/accreditation-review-workspace";
import { getApprovedAdvisers } from "@/lib/actions/advisers";

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

  const { data: requests, error } = await adminClient
    .from("accreditation_requests")
    .select(`
      id, 
      org_name, 
      org_type, 
      created_at, 
      assigned_adviser_id,
      advisers (
        name
      )
    `)
    .eq("status", "pending")
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

  const advisers = await getApprovedAdvisers();

  // Map to the format expected by AccreditationReviewWorkspace
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedOrgs = (requests || []).map((req: any) => ({
    id: req.id,
    name: req.org_name,
    type: req.org_type || "Unknown Type",
    priority: "STANDARD", // Can be dynamic if needed
    time: new Date(req.created_at).toLocaleDateString(), // Basic formatting
    adviserId: req.assigned_adviser_id,
    adviserName: req.advisers?.name || "Pending Assignment",
  }));

  return <AccreditationReviewWorkspace initialOrgs={mappedOrgs} advisers={advisers} />;
}
