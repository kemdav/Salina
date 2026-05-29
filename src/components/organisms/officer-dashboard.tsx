"use client";

import Link from "next/link";
import { StatCard } from "@/components/molecules/stat-card";
import {
  DashboardShell,
  DashboardSection,
  DashboardStatRow,
} from "@/components/templates/dashboard-shell";
import { EventList } from "@/components/molecules/event-list";
import { StatusBadge } from "@/components/atoms/status-badge";
import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";
import type {
  DashboardStats,
  ActivityItem,
  UpcomingEvent,
  MemberSummary,
} from "@/lib/dashboard-queries";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function IconSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
    >
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface OfficerDashboardProps {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingEvents: UpcomingEvent[];
  memberSummary: MemberSummary;
  tenantBranding?: AuthenticatedTenantBranding;
  customPermissions?: string[];
}

// ---------------------------------------------------------------------------
// Member Roster Summary (status/dues breakdown)
// ---------------------------------------------------------------------------

function MemberRosterSummary({ summary }: { summary: MemberSummary }) {
  const statusEntries = Object.entries(summary.byStatus).sort(
    ([, a], [, b]) => b - a,
  );
  const duesEntries = Object.entries(summary.byDues).sort(
    ([, a], [, b]) => b - a,
  );

  const maxStatus = Math.max(...Object.values(summary.byStatus), 1);
  const maxDues = Math.max(...Object.values(summary.byDues), 1);

  const statusVariant = (status: string): "green" | "yellow" | "red" => {
    switch (status) {
      case "Active":
        return "green";
      case "Probation":
        return "yellow";
      case "Suspended":
        return "red";
      default:
        return "yellow";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            By Status
          </span>
          <span className="text-sm font-bold text-slate-800">
            {summary.total}
          </span>
        </div>
        <div className="space-y-2">
          {statusEntries.map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <StatusBadge variant={statusVariant(status)}>
                {status}
              </StatusBadge>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-700 transition-all"
                  style={{ width: `${(count / maxStatus) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium tabular-nums text-slate-600">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            By Dues
          </span>
        </div>
        <div className="space-y-2">
          {duesEntries.map(([dues, count]) => (
            <div key={dues} className="flex items-center gap-3">
              <StatusBadge
                variant={dues === "Paid" ? "green" : "red"}
              >
                {dues}
              </StatusBadge>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-700 transition-all"
                  style={{ width: `${(count / maxDues) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium tabular-nums text-slate-600">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">No recent activity to show.</p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => {
        const time = new Date(item.timestamp);
        const timeAgo = formatTimeAgo(time);

        return (
          <li
            key={`${item.kind}-${item.id}`}
            className="flex gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span
              className={
                "mt-0.5 flex h-2 w-2 shrink-0 rounded-full " +
                (item.kind === "announcement"
                  ? "bg-blue-500"
                  : item.kind === "event"
                    ? "bg-emerald-500"
                    : "bg-slate-400")
              }
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-slate-800">
                  {item.title}
                </span>
                {item.category && (
                  <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {item.category}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                  {item.description}
                </p>
              )}
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {timeAgo}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Quick Actions (conditionally gated by permissions)
// ---------------------------------------------------------------------------

function OfficerQuickActions({
  canManageEvents,
  canManageAnnouncements,
  canManageRecruitment,
}: {
  canManageEvents: boolean;
  canManageAnnouncements: boolean;
  canManageRecruitment: boolean;
}) {
  const actions = [
    {
      label: "Create Event",
      href: "/officer/events",
      active: canManageEvents,
      icon: (
        <IconSvg>
          <path d="M12 4v16m8-8H4" />
        </IconSvg>
      ),
    },
    {
      label: "Post Announcement",
      href: "/officer/feed",
      active: canManageAnnouncements,
      icon: (
        <IconSvg>
          <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </IconSvg>
      ),
    },
    {
      label: "Take Attendance",
      href: "/officer/attendance",
      active: canManageEvents,
      icon: (
        <IconSvg>
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-5l2 2 4-4" />
        </IconSvg>
      ),
    },
    {
      label: "Manage Recruitment",
      href: "/officer/recruitment",
      active: canManageRecruitment,
      icon: (
        <IconSvg>
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </IconSvg>
      ),
    },
    {
      label: "View Roster",
      href: "/officer/members",
      active: true,
      icon: (
        <IconSvg>
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </IconSvg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) =>
        action.active ? (
          <Link
            key={action.label}
            href={action.href}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            {action.icon}
            {action.label}
          </Link>
        ) : (
          <button
            key={action.label}
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-400"
            title="You do not have permission to access this feature"
          >
            {action.icon}
            {action.label}
          </button>
        ),
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function OfficerDashboard({
  stats,
  recentActivity,
  upcomingEvents,
  memberSummary,
  tenantBranding,
  customPermissions = [],
}: OfficerDashboardProps) {
  const canManageEvents = customPermissions.includes("Event management");
  const canManageAnnouncements = customPermissions.includes(
    "Announcement management",
  );
  const canManageRecruitment = customPermissions.includes("Recruitment reviews");

  const activeMemberCount =
    memberSummary.byStatus["Active"] ?? 0;
  const probCount = memberSummary.byStatus["Probation"] ?? 0;

  return (
    <DashboardShell>
      {/* Stat cards row — full width */}
      <DashboardStatRow>
        <StatCard
          label="Total Members"
          value={memberSummary.total}
          trend={probCount > 0 ? "down" : "neutral"}
          trendLabel={probCount > 0 ? `${probCount} probation` : undefined}
          icon={
            <IconSvg>
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </IconSvg>
          }
          iconClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Upcoming Events"
          value={stats.eventCount}
          icon={
            <IconSvg>
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </IconSvg>
          }
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Pending Applicants"
          value={stats.pendingApplicantCount}
          icon={
            <IconSvg>
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </IconSvg>
          }
          iconClass="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Active Announcements"
          value={stats.announcementCount}
          icon={
            <IconSvg>
              <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </IconSvg>
          }
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Active Members"
          value={activeMemberCount}
          trend={
            activeMemberCount < memberSummary.total ? "down" : "neutral"
          }
          icon={
            <IconSvg>
              <path d="M5 13l4 4L19 7" />
            </IconSvg>
          }
          iconClass="bg-green-50 text-green-600"
        />
      </DashboardStatRow>

      {/* Upcoming Events + Member Roster Summary */}
      <DashboardSection title="Upcoming Events">
        <EventList
          canManage={canManageEvents}
          events={upcomingEvents}
          tenant={
            tenantBranding ?? {
              name: "Organization",
              primaryColor: "#c6623e",
              textColor: "#ffffff",
            }
          }
          onEventClick={() => {}}
        />
      </DashboardSection>

      <DashboardSection title="Member Roster Summary">
        <MemberRosterSummary summary={memberSummary} />
      </DashboardSection>

      {/* Recent Activity */}
      <DashboardSection title="Recent Activity" fullWidth>
        <ActivityFeed items={recentActivity} />
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions" fullWidth>
        <OfficerQuickActions
          canManageEvents={canManageEvents}
          canManageAnnouncements={canManageAnnouncements}
          canManageRecruitment={canManageRecruitment}
        />
      </DashboardSection>
    </DashboardShell>
  );
}
