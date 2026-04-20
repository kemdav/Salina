'use client';

import { useState } from "react";
import { UserRole, ROLE_ROUTES } from "@/lib/navigation-config";
import { NavItem } from "@/components/atoms/nav-item";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface TenantBranding {
    name: string;
    logo?: string;
    primaryColor: string;
    textColor: string;
}

interface SidebarNavProps {
    role: UserRole;
    tenant?: TenantBranding;
}

export function SidebarNav({ role, tenant }: SidebarNavProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname(); // Used to highlight the active route
    const isSuperAdmin = role === 'SuperAdmin';

    // --- Dynamic Styling Logic ---
    // SuperAdmin gets a default dark slate theme. 
    // Everyone else gets the physical Primary Color background and Text Color of their Org.
    const sidebarStyles = isSuperAdmin ? {
        backgroundColor: '#0f172a', // Slate 900
        color: '#f8fafc',
        '--sidebar-active-bg': 'rgba(255,255,255,0.1)',
        '--sidebar-active-text': '#ffffff',
        '--sidebar-text': '#94a3b8', // Slate 400
        '--sidebar-hover-bg': 'rgba(255,255,255,0.05)',
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

    // Fallback Initial for Logo
    const orgInitial = isSuperAdmin ? 'S' : (tenant?.name.charAt(0) || 'O');
    const orgName = isSuperAdmin ? 'Salina Super Admin' : (tenant?.name || 'Organization');

    return (
        <aside 
            className={cn(
                "relative flex flex-col h-screen transition-all duration-300 shadow-xl z-20 shrink-0",
                isCollapsed ? "w-[80px]" : "w-[260px]"
            )}
            style={sidebarStyles}
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-transform z-30"
                style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            >
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Header / Logo Area */}
            <div className="h-20 flex items-center px-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Logo Placeholder / Fallback */}
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner">
                        {tenant?.logo ? (
                            <img src={tenant.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                            orgInitial
                        )}
                    </div>
                    
                    <div className={cn("flex flex-col transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        <span className="font-bold tracking-tight text-sm truncate w-[160px]">{orgName}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">{role}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links Area */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20">
                {ROLE_ROUTES[role].map((route) => {
                    // Simple active check. In reality, you might want exact matching depending on your routes.
                    const isActive = pathname?.includes(route.href); 
                    
                    return (
                        <NavItem
                            key={route.label}
                            href={route.href}
                            icon={route.icon}
                            label={route.label}
                            isActive={isActive}
                            isCollapsed={isCollapsed}
                        />
                    );
                })}
            </nav>

            {/* Footer / Current User Area (Placeholder) */}
            <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className={cn("flex flex-col transition-all duration-300 whitespace-nowrap", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
                        <span className="text-sm font-medium leading-none">Jane Doe</span>
                        <span className="text-xs opacity-70 mt-1">{role}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}