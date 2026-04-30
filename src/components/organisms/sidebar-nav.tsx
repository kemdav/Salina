"use client";

import { useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { UserRole, getSidebarRoutes } from "@/lib/navigation-config";
import { NavItem } from "@/components/atoms/nav-item";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  role: UserRole;
  tenant?: AuthenticatedTenantBranding;
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

export function SidebarNav({
  role,
  tenant,
  userName = "Jane Doe",
}: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const isSuperAdmin = role === "SuperAdmin";
  const navItems = getSidebarRoutes(role) ?? [];
  const workspaceLogo = tenant?.logoUrl || tenant?.logo;

  const sidebarStyles = isSuperAdmin
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
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
        {isSuperAdmin ? (
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
              style={workspaceLogo ? { backgroundColor: tenant?.primaryColor } : undefined}
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

      <nav
        className="relative flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <div
          className="pointer-events-none absolute left-3 right-3 z-0 h-10.5 rounded-lg bg-(--sidebar-hover-bg,rgba(255,255,255,0.05)) transition-all duration-300 ease-out"
          style={{
            top: "24px",
            transform: `translateY(${hoveredIndex !== null ? hoveredIndex * 48 : 0}px)`,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {navItems.map((route, index) => {
          const isActive =
            pathname === route.href || pathname?.startsWith(`${route.href}/`);

          return (
            <NavItem
              key={route.label}
              href={route.href}
              icon={route.icon}
              label={
                role === "Officer" && route.href.endsWith("/members")
                  ? "Roster"
                  : route.label
              }
              isActive={isActive}
              isCollapsed={isCollapsed}
              onMouseEnter={() => setHoveredIndex(index)}
            />
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg bg-white/5 p-2 transition-colors hover:bg-white/10">
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
              {role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
