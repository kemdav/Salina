'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    isCollapsed?: boolean;
    onMouseEnter?: () => void;
}

export function NavItem({ href, icon, label, isActive = false, isCollapsed = false, onMouseEnter }: NavItemProps) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : undefined}
            onMouseEnter={onMouseEnter}
            className={cn(
                "relative z-10 flex items-center gap-3 pl-4 pr-3 h-[42px] rounded-lg transition-all duration-300 ease-out group overflow-hidden",
                isActive 
                    ? "bg-[var(--sidebar-active-bg,rgba(255,255,255,0.08))] text-[var(--sidebar-active-text,#ffffff)] font-medium" 
                    : "text-[var(--sidebar-text,#94a3b8)] hover:text-[var(--sidebar-hover-text,#f8fafc)]"
            )}
        >
            {isActive && (
                <div className="absolute left-0 top-[15%] bottom-[15%] w-1 rounded-r-md bg-[var(--sidebar-active-text,#ffffff)] animate-in slide-in-from-left-2 duration-300" />
            )}

            <div className={cn(
                "flex-shrink-0 transition-all duration-300 ease-out", 
                isActive ? "scale-110" : "group-hover:scale-110 group-hover:-translate-y-0.5 text-opacity-80 group-hover:text-opacity-100"
            )}>
                {icon}
            </div>

            <span className={cn(
                "whitespace-nowrap transition-all duration-300 ease-out",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 flex-1",
                !isActive && !isCollapsed && "group-hover:translate-x-1" 
            )}>
                {label}
            </span>
        </Link>
    );
}