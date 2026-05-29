"use client";

import Link from "next/link";
import { StatCard } from "@/components/molecules/stat-card";
import {
  DashboardShell,
  DashboardSection,
  DashboardStatRow,
} from "@/components/templates/dashboard-shell";
import { EventList } from "@/components/molecules/event-list";
import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";
import type {
  DashboardStats,
  ActivityItem,
  UpcomingEvent,
} from "@/lib/dashboard-queries";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline SVG icons (matching the codebase stroke style)
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

interface MemberDashboardProps {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingEvents: UpcomingEvent[];
  tenantBranding?: AuthenticatedTenantBranding;
}

// ---------------------------------------------------------------------------
// Activity feed (read-only timeline)
// ---------------------------------------------------------------------------

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
          <li key={`${item.kind}-${item.id}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <span
              className={cn(
                "mt-0.5 flex h-2 w-2 shrink-0 rounded-full",
                item.kind === "announcement"
                  ? "bg-blue-500"
                  : item.kind === "event"
                    ? "bg-emerald-500"
                    : "bg-slate-400",
              )}
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
// Quick Actions bar
// ---------------------------------------------------------------------------

function QuickActions() {
  const actions = [
    {
      label: "My ID Card",
      href: "/member/id",
      active: true,
      icon: (
        <IconSvg>
          <path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
          <path d="M8 11h3m-3 4h8M9.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </IconSvg>
      ),
    },
    {
      label: "View Events",
      href: "/member/events",
      active: true,
      icon: (
        <IconSvg>
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </IconSvg>
      ),
    },
    {
      label: "View Documents",
      href: "/member/documents",
      active: true,
      icon: (
        <IconSvg>
          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
            title="Coming soon"
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
// Time formatting helper
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemberDashboard({
  stats,
  recentActivity,
  upcomingEvents,
  tenantBranding,
}: MemberDashboardProps) {
  return (
    <DashboardShell>
      {/* Stat cards row — full width */}
      <DashboardStatRow>
        <StatCard
          label="Organization Members"
          value={stats.memberCount}
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
          label="Announcements"
          value={stats.announcementCount}
          icon={
            <IconSvg>
              <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </IconSvg>
          }
          iconClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplicantCount}
          icon={
            <IconSvg>
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </IconSvg>
          }
          iconClass="bg-purple-50 text-purple-600"
        />
      </DashboardStatRow>

      {/* Upcoming Events + Activity Feed */}
      <DashboardSection title="Upcoming Events">
        <EventList
          events={upcomingEvents}
          tenant={tenantBranding ?? { name: "Organization", primaryColor: "#c6623e", textColor: "#ffffff" }}
          onEventClick={() => {}}
        />
      </DashboardSection>

      <DashboardSection title="Recent Activity">
        <ActivityFeed items={recentActivity} />
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection title="Quick Actions" fullWidth>
        <QuickActions />
      </DashboardSection>
    </DashboardShell>
  );
}
