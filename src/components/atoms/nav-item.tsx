'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    isCollapsed?: boolean;
}

export function NavItem({ href, icon, label, isActive = false, isCollapsed = false }: NavItemProps) {
    return (
        <Link
            href={href}
            // If the user collapses the sidebar, we'll use the native 'title' attribute as a quick tooltip
            title={isCollapsed ? label : undefined}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                // Notice we use color variables. The parent Organism will pass down --sidebar-bg and --sidebar-text.
                isActive 
                    ? "bg-[var(--sidebar-active-bg,rgba(255,255,255,0.1))] text-[var(--sidebar-active-text,#ffffff)] font-medium shadow-sm" 
                    : "text-[var(--sidebar-text,#94a3b8)] hover:bg-[var(--sidebar-hover-bg,rgba(255,255,255,0.05))] hover:text-[var(--sidebar-hover-text,#f8fafc)]"
            )}
        >
            <div className={cn(
                "flex-shrink-0 transition-transform duration-200", 
                isActive ? "scale-110" : "group-hover:scale-110"
            )}>
                {icon}
            </div>

            {/* When collapsed, we visually hide the label but keep it in the DOM for screen readers */}
            <span className={cn(
                "whitespace-nowrap transition-all duration-300",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1"
            )}>
                {label}
            </span>
            
            {/* Optional active indicator pill (looks great on modern sidebars) */}
            {isActive && !isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--sidebar-active-text,#ffffff)]" />
            )}
        </Link>
    );
}