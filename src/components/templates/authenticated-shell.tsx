'use client';

import { UserRole } from "@/lib/navigation-config";
import { SidebarNav } from "@/components/organisms/sidebar-nav";

interface AuthenticatedShellProps {
    children?: React.ReactNode;
    role: UserRole;
    tenantBranding?: {
        name: string;
        primaryColor: string;
        textColor: string;
    };
}

export function AuthenticatedShell({ children, role, tenantBranding }: AuthenticatedShellProps) {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-[family:var(--font-body)]">
            
            {/* The Dynamic Sidebar */}
            <SidebarNav role={role} tenant={tenantBranding} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                
                {/* Top Bar (Header) */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                            {/* This would be dynamic based on the page later */}
                            Overview
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell Placeholder */}
                        <button className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children ? (
                        children
                    ) : (
                        /* Empty State Placeholder (As requested in Acceptance Criteria) */
                        <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">Content Area Empty</h3>
                            <p className="text-sm text-slate-500 max-w-sm text-center">
                                Organisms will be injected here. Currently viewing as <span className="font-semibold text-slate-700">{role}</span>.
                            </p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}