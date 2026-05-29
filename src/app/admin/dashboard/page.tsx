import Link from "next/link";
import { getMembers } from "@/lib/actions/members";
import { getEvents } from "@/lib/actions/events";
import {
  resolveCurrentTenant,
  createSupabaseUserClient,
} from "@/lib/supabase/server";

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

export default async function AdminDashboardPage() {
  const { tenant } = await resolveCurrentTenant();
  const userClient = await createSupabaseUserClient();

  let totalMembers = 0;
  let activeApplicants = 0;
  let upcomingEvents = 0;
  let pendingDues = 0;
  let activities: {
    initials: string;
    name: string;
    action: string;
    time: string;
    timestamp: number;
  }[] = [];

  if (tenant && userClient) {
    // Members & Dues
    const members = await getMembers().catch(() => []);
    totalMembers = members.length;
    pendingDues = members.filter((m) => m.dues === "Unpaid").length;

    const recentMembersActivity = members
      .sort(
        (a, b) =>
          new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
      )
      .slice(0, 3)
      .map((m) => ({
        initials: (m.name || "??").substring(0, 2).toUpperCase(),
        name: m.name || "Unknown",
        action: "joined as Member",
        time: formatTimeAgo(m.joinedAt),
        timestamp: new Date(m.joinedAt).getTime(),
      }));

    // Applicants
    const { data: recentApplicants } = await userClient
      .from("temporary_applicants")
      .select("applicant_name, created_at")
      .eq("tenant_id", tenant.id)
      .eq("status", "pending");

    activeApplicants = recentApplicants?.length || 0;

    const recentApplicantsActivity = (recentApplicants || []).map((app) => ({
      initials: (app.applicant_name || "??").substring(0, 2).toUpperCase(),
      name: app.applicant_name || "Unknown Applicant",
      action: "submitted application",
      time: formatTimeAgo(app.created_at),
      timestamp: new Date(app.created_at).getTime(),
    }));

    // Events
    const events = await getEvents().catch(() => []);
    const now = new Date();
    upcomingEvents = events.filter(
      (e: { start_time: string }) => new Date(e.start_time) >= now,
    ).length;

    // Combine Activities
    activities = [...recentMembersActivity, ...recentApplicantsActivity]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }

  const METRIC_CARDS = [
    { label: "Total Members", value: totalMembers.toString() },
    { label: "Active Applicants", value: activeApplicants.toString() },
    { label: "Upcoming Events", value: upcomingEvents.toString() },
    { label: "Pending Dues", value: pendingDues.toString() },
  ];

  const QUICK_ACTIONS = [
    { label: "Invite Member", href: "/admin/members" },
    { label: "Create Event", href: "/admin/events" },
    { label: "Post Announcement", href: "/admin/feed" },
    { label: "View Applicants", href: "/admin/recruitment" },
    { label: "Export Roster", href: "/admin/members" },
    { label: "Manage Roles", href: "/admin/roles" },
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
          Here is what&apos;s happening in your organization today.
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
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2
          className="mb-4 text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Recent Activity
        </h2>

        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {activities.length > 0 ? (
            activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {activity.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.name}{" "}
                    <span className="font-normal text-slate-500">
                      {activity.action}
                    </span>
                  </p>
                </div>
                <p className="shrink-0 text-xs text-slate-500">
                  {activity.time}
                </p>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center px-4 py-8 text-sm text-slate-500">
              No recent activity
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
          Quick Actions
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="cursor-pointer rounded-2xl border border-border bg-white p-6 text-left text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
