import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentViewer } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    if (diffHours === 0) return "Just now";
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export const dynamic = "force-dynamic";

export default async function AdviserDashboardPage() {
  const viewer = await getCurrentViewer();
  if (!viewer) redirect("/login");

  const adminClient = createSupabaseAdminClient("adviser-dashboard");
  if (!adminClient) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Adviser Dashboard is unavailable because the server configuration is missing.
      </div>
    );
  }

  // Get adviser details
  const { data: adviser } = await adminClient
    .from("advisers")
    .select("id, name")
    .eq("user_id", viewer.id)
    .single();

  if (!adviser) redirect("/onboarding");

  // Query stats
  const { count: totalOrgsCount } = await adminClient
    .from("organizations")
    .select("*", { count: "exact", head: true })
    .neq("slug", "salina")
    .neq("slug", "system-admin");

  const { count: pendingAccreditationCount } = await adminClient
    .from("accreditation_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: myAssignedCount } = await adminClient
    .from("accreditation_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .eq("assigned_adviser_id", adviser.id);

  // Fetch recent pending requests
  const { data: recentRequests } = await adminClient
    .from("accreditation_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  const METRIC_CARDS = [
    {
      label: "Total Organizations",
      value: (totalOrgsCount || 0).toLocaleString(),
    },
    {
      label: "Pending Accreditation",
      value: (pendingAccreditationCount || 0).toLocaleString(),
    },
    {
      label: "My Assigned Reviews",
      value: (myAssignedCount || 0).toLocaleString(),
    },
  ];

  const ACCREDITATION_REQUESTS = (recentRequests || []).map((req) => ({
    title: `${req.org_type || "Organization"} Certification Request`,
    sub: `Submitted by ${req.org_name} · ${formatTimeAgo(req.created_at)}`,
  }));

  const QUICK_ACTIONS = [
    {
      label: "Review Accreditation Requests",
      href: "/adviser/accreditations",
    },
    {
      label: "View Adviser Directory",
      href: "/adviser/advisers",
    },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-base text-slate-500">
          Welcome back, {adviser.name}. Here is what&apos;s happening today.
        </p>
      </div>

      {/* Metric cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {METRIC_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-white p-6 shadow-sm"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              {card.label}
            </p>
            <p
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Accreditation Requests */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recent accreditation requests
          </h2>
          <Link
            href="/adviser/accreditations"
            className="text-sm text-primary transition-colors hover:underline"
          >
            Review all
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {ACCREDITATION_REQUESTS.map((req, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border px-4 py-4 last:border-0"
            >
              <div className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {req.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{req.sub}</p>
                </div>
              </div>
              <Link
                href="/adviser/accreditations"
                className="text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:underline"
              >
                Review
              </Link>
            </div>
          ))}
          {ACCREDITATION_REQUESTS.length === 0 && (
            <div className="flex items-center justify-center px-4 py-8 text-sm text-slate-500">
              No pending accreditation requests
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="cursor-pointer inline-flex rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
