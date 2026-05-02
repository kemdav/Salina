"use client";

import { usePathname } from "next/navigation";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import type { UserRole } from "@/lib/navigation-config";
import { NotificationBell } from "@/components/organisms/notification-bell";
import {
  superAdminNotifications,
  adminNotifications,
  officerNotifications,
  memberNotifications
} from "@/lib/notification-data";

export interface AuthenticatedTenantBranding {
  name: string;
  primaryColor: string;
  textColor: string;
  logo?: string;
  logoUrl?: string;
}

interface AuthenticatedTopBarProps {
  role: UserRole;
  tenantBranding?: AuthenticatedTenantBranding;
  userName?: string;
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function AuthenticatedTopBar({ role, tenantBranding,
  userName = "Jane Doe",
}: AuthenticatedTopBarProps) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);
  const roleSegment = segments[0] || "";
  const lastSegment = segments[segments.length - 1] || "dashboard";
  const workspaceName = tenantBranding?.name ?? "Workspace";
  const workspaceLogo = tenantBranding?.logoUrl || tenantBranding?.logo;
  const workspaceInitial = workspaceName.trim().slice(0, 1).toUpperCase() || "W";
  const userInitials = getInitials(userName);

  const ROUTE_TITLES: Record<string, string> = {
    dashboard: "Dashboard",
    feed: "Announcements",
    attendance: "Attendance",
    members: "Members",
    organizations: "Organizations",
    recruitment: "Recruitment",
    events: "Events",
    roles: "Roles",
    settings: "Settings",
    review: "Review",
    accreditations: "Accreditations",
    advisers: "Advisers",
    id: "My Digital ID",
  };

  const routeLabel =
    roleSegment === "officer" && lastSegment === "members"
      ? "Roster"
      : ROUTE_TITLES[lastSegment] ||
      lastSegment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
          style={tenantBranding ? { backgroundColor: tenantBranding.primaryColor } : undefined}
        >
          {workspaceLogo ? (
            <div
              className="h-full w-full bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${workspaceLogo})` }}
            />
          ) : tenantBranding ? (
            <span
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{ color: tenantBranding.textColor }}
            >
              {workspaceInitial}
            </span>
          ) : (
            <SalinaLogo variant="dark" width={88} className="w-20" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Workspace
          </p>
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              {workspaceName}
            </h1>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {role}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
            {routeLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell
          initialNotifications={
            role === "SuperAdmin" ? superAdminNotifications :
              role === "Admin" ? adminNotifications :
                role === "Officer" ? officerNotifications :
                  memberNotifications
          }
        />

        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-left shadow-sm transition-colors hover:bg-slate-50"
          aria-label={`User menu for ${userName}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {userInitials}
          </div>
          <div className="hidden pr-1 sm:block">
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
