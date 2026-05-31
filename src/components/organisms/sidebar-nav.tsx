"use client";

import { useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import {
  UserRole,
  getSidebarRoutes,
  type NavRoute,
  type SidebarRouteOptions,
} from "@/lib/navigation-config";
import { NavItem } from "@/components/atoms/nav-item";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  role: UserRole;
  tenant?: AuthenticatedTenantBranding;
  userName?: string;
  isTemporaryApplicant?: boolean;
  customPermissions?: string[];
  onSignOut?: () => void;
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

export function SidebarNav({
  role,
  tenant,
  userName = "Jane Doe",
  isTemporaryApplicant = false,
  customPermissions = [],
  onSignOut,
}: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isPlatformLevel = role === "SuperAdmin" || role === "Adviser";
  const routeOptions: SidebarRouteOptions = isTemporaryApplicant
    ? { temporaryApplicant: true }
    : {};
  const baseNavItems = getSidebarRoutes(role, routeOptions) ?? [];

  // Inject additional nav items based on custom permissions if the user is a Member
  let extraRoutes: NavRoute[] = [];
  if (role === "Member" || role === "Officer") {
    if (customPermissions.includes("Announcement posting")) {
      extraRoutes.push({
        label: "Feed",
        href: "/officer/feed",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h6m-6 4h8M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V7a2 2 0 012-2z"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
    }
    if (customPermissions.includes("Event management")) {
      extraRoutes.push({
        label: "Events",
        href: "/officer/events",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
      extraRoutes.push({
        label: "Attendance",
        href: "/officer/attendance",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-5l2 2 4-4"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
    }
    if (customPermissions.includes("Recruitment reviews")) {
      extraRoutes.push({
        label: "Recruitment",
        href: "/officer/recruitment",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
    }
    if (customPermissions.includes("Temporary role assignment")) {
      extraRoutes.push({
        label: "Members",
        href: "/officer/members",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
    }
    if (customPermissions.includes("Settings access")) {
      extraRoutes.push({
        label: "Settings",
        href: "/officer/settings",
        icon: (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        visibleTo: ["Member" as const, "Officer" as const],
      });
    }

    // Filter out extraRoutes if their href already exists in baseNavItems
    extraRoutes = extraRoutes.filter(
      (route) => !baseNavItems.find((n) => n.href === route.href),
    );
  }

  const workspaceLogo = tenant?.logoUrl || tenant?.logo;

  const sidebarStyles = isPlatformLevel
    ? ({
        backgroundColor: "#020817",
        color: "#f8fafc",
        "--sidebar-active-bg": "rgba(255,255,255,0.06)",
        "--sidebar-active-text": "#ffffff",
        "--sidebar-text": "#94a3b8",
        "--sidebar-hover-bg": "rgba(255,255,255,0.04)",
        "--sidebar-hover-text": "#f8fafc",
      } as CSSProperties)
    : ({
        backgroundColor: tenant?.primaryColor || "#c6623e",
        color: tenant?.textColor || "#ffffff",
        "--sidebar-active-bg": "rgba(255,255,255,0.15)",
        "--sidebar-active-text": tenant?.textColor || "#ffffff",
        "--sidebar-text": "rgba(255,255,255,0.7)",
        "--sidebar-hover-bg": "rgba(255,255,255,0.1)",
        "--sidebar-hover-text": tenant?.textColor || "#ffffff",
      } as CSSProperties);

  const orgName = tenant?.name || "Organization";
  const orgInitial = tenant?.name.charAt(0) || "O";

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 flex h-screen shrink-0 flex-col self-start shadow-xl transition-all duration-300",
        isCollapsed ? "w-20" : "w-65",
      )}
      style={sidebarStyles}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed((value) => !value)}
        className="absolute -right-3 top-20 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-transform hover:bg-slate-50"
        style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
        {isPlatformLevel ? (
          <div
            className={cn(
              "flex items-center transition-all duration-300",
              isCollapsed ? "w-8 overflow-hidden" : "w-32",
            )}
          >
            <SalinaLogo variant="dark" width={104} className="w-24" />
          </div>
        ) : (
          <div className="flex w-full items-center gap-3 overflow-hidden">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/10 text-lg font-bold shadow-inner"
              style={
                workspaceLogo
                  ? { backgroundColor: tenant?.primaryColor }
                  : undefined
              }
            >
              {workspaceLogo ? (
                <div
                  className="h-full w-full bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${workspaceLogo})` }}
                />
              ) : (
                orgInitial
              )}
            </div>
            <div
              className={cn(
                "flex flex-col whitespace-nowrap transition-all duration-300",
                isCollapsed ? "w-0 opacity-0" : "opacity-100",
              )}
            >
              <span className="w-40 truncate text-[15px] font-bold leading-tight tracking-tight">
                {orgName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                {role}
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="relative flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20">
        {baseNavItems.map((route) => {
          const isActive =
            pathname === route.href || pathname?.startsWith(`${route.href}/`);

          const label =
            role === "Officer" && route.href.endsWith("/members")
              ? "Roster"
              : role === "Member" && route.href.endsWith("/feed")
                ? "Home Feed"
                : role === "Member" && route.href === "/member/events"
                  ? "Calendar"
                  : role === "Member" && route.href.endsWith("/id")
                    ? "My ID"
                    : role === "Member" && route.href.endsWith("/applications")
                      ? isTemporaryApplicant
                        ? "Application"
                        : route.label
                      : route.label;

          return (
            <NavItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              label={label}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}

        {extraRoutes.length > 0 && (
          <div className="my-2 border-t border-white/10 mx-3 shrink-0" />
        )}

        {extraRoutes.map((route) => {
          const isActive =
            pathname === route.href || pathname?.startsWith(`${route.href}/`);

          const label =
            role === "Officer" && route.href.endsWith("/members")
              ? "Roster"
              : role === "Member" && route.href.startsWith("/officer/settings")
                ? "Settings (Admin)"
                : role === "Member" && route.href.startsWith("/officer/feed")
                  ? "Home Feed (Admin)"
                  : route.label;

          return (
            <NavItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              label={label}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div
          className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10"
          onClick={onSignOut}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSignOut?.();
          }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-[11px] font-semibold text-slate-900">
            {getInitials(userName)}
          </div>
          <div
            className={cn(
              "flex flex-col whitespace-nowrap transition-all duration-300",
              isCollapsed ? "w-0 opacity-0" : "opacity-100",
            )}
          >
            <span className="text-sm font-medium leading-none text-(--sidebar-active-text,#ffffff)">
              {userName}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-(--sidebar-text,#94a3b8)">
              Sign out
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
