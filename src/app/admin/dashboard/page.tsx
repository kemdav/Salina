import Link from "next/link";

const METRIC_CARDS = [
  { label: "Total Members", value: "124" },
  { label: "Active Applicants", value: "18" },
  { label: "Upcoming Events", value: "3" },
  { label: "Pending Dues", value: "12" },
];

const ACTIVITIES = [
  {
    initials: "JD",
    name: "John Doe",
    action: "joined as Member",
    time: "2 hours ago",
  },
  {
    initials: "AS",
    name: "Anna Smith",
    action: "submitted application",
    time: "5 hours ago",
  },
  {
    initials: "RJ",
    name: "Robert Johnson",
    action: "paid dues",
    time: "Yesterday",
  },
];

const QUICK_ACTIONS = [
  { label: "Invite Member", href: "/admin/members" },
  { label: "Create Event", href: "/admin/events" },
  { label: "Post Announcement", href: "/admin/feed" },
  { label: "View Applicants", href: "/admin/recruitment" },
  { label: "Export Roster", href: "/admin/members" },
  { label: "Manage Roles", href: "/admin/roles" },
];

export default function AdminDashboardPage() {
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
          {ACTIVITIES.map((activity, i) => (
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
              <p className="shrink-0 text-xs text-slate-500">{activity.time}</p>
            </div>
          ))}
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
