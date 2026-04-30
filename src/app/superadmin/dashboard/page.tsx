import Link from "next/link";
const METRIC_CARDS = [
  { label: "Total Organizations", value: "1,284" },
  { label: "Pending Accreditation", value: "42" },
  { label: "Active Members", value: "18.5k" },
  { label: "New This Week", value: "156", badge: "+10%" },
];

const RECENT_ORGS = [
  {
    initials: "AL",
    name: "Aether Labs",
    slug: "aether-labs",
    status: "ACTIVE",
    created: "Oct 20",
  },
  {
    initials: "VS",
    name: "Vanguard Systems",
    slug: "vanguard-sys",
    status: "PENDING",
    created: "Oct 19",
  },
  {
    initials: "NX",
    name: "Nexus Core",
    slug: "nexus-core",
    status: "ACTIVE",
    created: "Oct 18",
  },
  {
    initials: "OP",
    name: "Optic Prime",
    slug: "optic-prime",
    status: "INACTIVE",
    created: "Oct 15",
  },
  {
    initials: "QM",
    name: "Quantum Mechanics",
    slug: "quantum-mech",
    status: "ACTIVE",
    created: "Oct 12",
  },
];

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border border-success/30",
  PENDING: "bg-warning/10 text-warning border border-warning/30",
  INACTIVE: "bg-slate-100 text-slate-500 border border-slate-200",
};

const ACCREDITATION_REQUESTS = [
  {
    title: "ISO 27001 Certification Request",
    sub: "Submitted by Aether Labs · 3 hours ago",
  },
  {
    title: "Annual Security Audit",
    sub: "Submitted by Nexus Core · 5 hours ago",
  },
  {
    title: "Governance Compliance Check",
    sub: "Submitted by Optic Prime · Yesterday",
  },
];

const QUICK_ACTIONS = [
  "Register New Organization",
  "Bulk Accreditation",
  "Generate Monthly Report",
];

export default function SuperAdminDashboardPage() {
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
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[org.status]}`}
                    >
                      {org.status}
                    </span>
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
                href="/superadmin/review"
                className="text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:underline"
              >
                Review
              </Link>
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
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              className="cursor-pointer rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
