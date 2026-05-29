import Link from "next/link";
import { getOrganizations } from "@/lib/actions/organizations";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/atoms/status-badge";

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

export default async function SuperAdminDashboardPage() {
  const orgs = await getOrganizations().catch(() => []);
  const adminClient = createSupabaseAdminClient("superadmin-dashboard");

  let pendingAccreditationCount = 0;
  let activeMembersCount = 0;
  let recentAccreditationRequests: {
    org_type: string;
    org_name: string;
    created_at: string;
  }[] = [];

  if (adminClient) {
    const { count: pendingCount } = await adminClient
      .from("accreditation_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    pendingAccreditationCount = pendingCount || 0;

    const { count: membersCount } = await adminClient
      .from("organization_memberships")
      .select("*", { count: "exact", head: true });

    activeMembersCount = membersCount || 0;

    const { data: requests } = await adminClient
      .from("accreditation_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    recentAccreditationRequests = requests || [];
  }

  // Calculate new this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const newThisWeekCount = orgs.filter(
    (org) => new Date(org.created_at) >= oneWeekAgo,
  ).length;
  const newLastWeekCount = orgs.filter((org) => {
    const createdDate = new Date(org.created_at);
    return createdDate >= twoWeeksAgo && createdDate < oneWeekAgo;
  }).length;

  let percentChange = 0;
  if (newLastWeekCount === 0) {
    percentChange = newThisWeekCount > 0 ? 100 : 0;
  } else {
    percentChange = Math.round(
      ((newThisWeekCount - newLastWeekCount) / newLastWeekCount) * 100,
    );
  }

  const badgeText =
    percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;

  const totalOrganizationsCount = orgs.length;

  const pendingOrgsCount = orgs.filter(
    (org) => org.status === "pending",
  ).length;
  const totalPendingAccreditation =
    pendingOrgsCount + pendingAccreditationCount;

  const METRIC_CARDS = [
    {
      label: "Total Organizations",
      value: totalOrganizationsCount.toLocaleString(),
    },
    {
      label: "Pending Accreditation",
      value: totalPendingAccreditation.toLocaleString(),
    },
    {
      label: "Active Members",
      value:
        activeMembersCount > 1000
          ? (activeMembersCount / 1000).toFixed(1) + "k"
          : activeMembersCount.toLocaleString(),
    },
    {
      label: "New This Week",
      value: newThisWeekCount.toLocaleString(),
      badge: badgeText,
    },
  ];

  const RECENT_ORGS = orgs.slice(0, 5).map((org) => ({
    initials: org.name.substring(0, 2).toUpperCase(),
    name: org.name,
    slug: org.slug,
    status: org.status.toLowerCase(),
    created: new Date(org.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const ACCREDITATION_REQUESTS = recentAccreditationRequests.map((req) => ({
    title: `${req.org_type || "Organization"} Certification Request`,
    sub: `Submitted by ${req.org_name} · ${formatTimeAgo(req.created_at)}`,
  }));

  const QUICK_ACTIONS = [
    {
      label: "Register New Organization",
      href: "/superadmin/organizations",
      disabled: false,
    },
    {
      label: "Bulk Accreditation",
      href: "/superadmin/accreditations",
      disabled: false,
    },
    {
      label: "Generate Monthly Report",
      href: "#",
      disabled: true,
      tooltip: "Coming soon",
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
          Welcome back, Super Admin. Here is what&apos;s happening today.
        </p>
      </div>

      {/* Metric cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              {card.badge && (
                <span className="ml-2 text-xs font-medium text-success">
                  {card.badge}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Organizations */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recent organizations
          </h2>
          <Link
            href="/superadmin/organizations"
            className="text-sm text-primary transition-colors hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50/50">
                {["Org Name", "Slug", "Status", "Created", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORGS.map((org) => (
                <tr
                  key={org.slug}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {org.initials}
                      </div>
                      <span className="font-medium text-foreground">
                        {org.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">
                    {org.slug}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        org.status === "active"
                          ? "green"
                          : org.status === "pending"
                            ? "yellow"
                            : "red"
                      }
                    >
                      {org.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {org.created}
                  </td>
                  <td className="px-4 py-3 cursor-pointer text-slate-400">⋯</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            href="/superadmin/accreditations"
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
                href="/superadmin/accreditations"
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
          {QUICK_ACTIONS.map((action) =>
            action.disabled ? (
              <button
                key={action.label}
                type="button"
                disabled
                title={action.tooltip}
                className="cursor-not-allowed opacity-50 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors"
              >
                {action.label}
              </button>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className="cursor-pointer inline-flex rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
              >
                {action.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
