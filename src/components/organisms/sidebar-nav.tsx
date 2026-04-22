'use client';

import { useState } from "react";
import { UserRole, getSidebarRoutes } from "@/lib/navigation-config";
import { NavItem } from "@/components/atoms/nav-item";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";

interface SidebarNavProps {
    role: UserRole;
    tenant?: AuthenticatedTenantBranding;
    userName?: string;
}

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'U';
}

export function SidebarNav({ role, tenant, userName = 'Jane Doe' }: SidebarNavProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const pathname = usePathname();
    const isSuperAdmin = role === 'SuperAdmin';
    const navItems = getSidebarRoutes(role);

    const sidebarStyles = isSuperAdmin ? {
        backgroundColor: '#020817',
        color: '#f8fafc',
        '--sidebar-active-bg': 'rgba(255,255,255,0.06)',
        '--sidebar-active-text': '#ffffff',
        '--sidebar-text': '#94a3b8',
        '--sidebar-hover-bg': 'rgba(255,255,255,0.04)',
        '--sidebar-hover-text': '#f8fafc',
    } as React.CSSProperties : {
        backgroundColor: tenant?.primaryColor || '#c6623e',
        color: tenant?.textColor || '#ffffff',
        '--sidebar-active-bg': 'rgba(255,255,255,0.15)',
        '--sidebar-active-text': tenant?.textColor || '#ffffff',
        '--sidebar-text': 'rgba(255,255,255,0.7)',
        '--sidebar-hover-bg': 'rgba(255,255,255,0.1)',
        '--sidebar-hover-text': tenant?.textColor || '#ffffff',
    } as React.CSSProperties;

    const orgName = tenant?.name || 'Organization';
    const orgInitial = tenant?.name.charAt(0) || 'O';

    return (
        <aside 
            className={cn(
                "relative flex flex-col h-screen transition-all duration-300 shadow-xl z-20 shrink-0",
                isCollapsed ? "w-[80px]" : "w-[260px]"
            )}
            style={sidebarStyles}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-transform z-30"
                style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            >
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
                {isSuperAdmin ? (
                    <div className={cn("flex items-center transition-all duration-300", isCollapsed ? "w-8 overflow-hidden" : "w-32")}>
                        <SalinaLogo variant="dark" width={104} className="w-24" />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 overflow-hidden w-full">
                        <div
                            className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg shadow-inner overflow-hidden border border-white/5"
                            style={tenant?.logo ? { backgroundColor: tenant.primaryColor } : undefined}
                        >
                            {tenant?.logo ? (
                                <div
                                    className="h-full w-full bg-center bg-cover bg-no-repeat"
                                    style={{ backgroundImage: `url(${tenant.logo})` }}
                                />
                            ) : (
                                orgInitial
                            )}
                        </div>
                        <div className={cn("flex flex-col transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                            <span className="font-bold tracking-tight text-[15px] truncate w-[160px] leading-tight">{orgName}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">{role}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* NAVIGATION LINKS */}
            <nav 
                className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5 relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <div 
                    className="absolute left-3 right-3 h-10.5 rounded-lg pointer-events-none transition-all duration-300 ease-out bg-(--sidebar-hover-bg,rgba(255,255,255,0.05)) z-0"
                    style={{
                        top: '24px', 
                        transform: `translateY(${hoveredIndex !== null ? hoveredIndex * 48 : 0}px)`, // 42px height + 6px gap = 48px jump
                        opacity: hoveredIndex !== null ? 1 : 0,
                    }}
                />

                {navItems.map((route, index) => {
                    const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`);
                    return (
                        <NavItem
                            key={route.label}
                            href={route.href}
                            icon={route.icon}
                            label={route.label}
                            isActive={isActive}
                            isCollapsed={isCollapsed}
                            onMouseEnter={() => setHoveredIndex(index)}
                        />
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden text-[11px] font-semibold text-slate-900">
                        {getInitials(userName)}
                    </div>
                    <div className={cn("flex flex-col transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        <span className="text-sm font-medium leading-none text-[var(--sidebar-active-text,#ffffff)]">{userName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--sidebar-text,#94a3b8)] mt-1">{role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}