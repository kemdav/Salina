import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AccreditationReviewWorkspace } from "@/components/organisms/accreditation-review-workspace";
import { getApprovedAdvisers } from "@/lib/actions/advisers";

export const dynamic = "force-dynamic";

export default async function AdviserAccreditationsPage() {
  const adminClient = createSupabaseAdminClient("adviser-accreditations");
  if (!adminClient) {
    return (
      <div className="text-sm text-slate-500">
        Configuration error.
      </div>
    );
  }

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
    console.error("Failed to fetch pending accreditations:", error);
    return (
      <div className="text-sm text-destructive">
        Failed to load accreditation requests.
      </div>
    );
  }

  const advisers = await getApprovedAdvisers();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedOrgs = (requests || []).map((req: any) => ({
    id: req.id,
    name: req.org_name,
    type: req.org_type || "Unknown Type",
    priority: "STANDARD",
    time: new Date(req.created_at).toLocaleDateString(),
    adviserId: req.assigned_adviser_id,
    adviserName: req.advisers?.name || "Pending Assignment",
  }));

  return (
    <div className="space-y-6">
      <AccreditationReviewWorkspace 
        initialOrgs={mappedOrgs} 
        advisers={advisers} 
        isAdviserMode={true} 
      />
    </div>
  );
}
