'use client';

import { usePathname } from 'next/navigation';

export interface AuthenticatedTenantBranding {
    name: string;
    primaryColor: string;
    textColor: string;
    logo?: string;
}

const ROUTE_TITLES: Record<string, string> = {
    dashboard: 'Dashboard',
    feed: 'Announcements',
    attendance: 'Attendance',
    members: 'Members',
    recruitment: 'Recruitment',
    events: 'Events',
    settings: 'Settings',
    review: 'Review',
    id: 'My Digital ID',
};

function formatTitle(segment: string) {
    return segment
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function AuthenticatedTopBar() {
    const pathname = usePathname() || '';

    const segments = pathname.split('/').filter(Boolean);
    const roleSegment = segments[0] || '';
    const lastSegment = segments[segments.length - 1] || 'dashboard';

    const rawTitle =
        roleSegment === 'officer' && lastSegment === 'members'
            ? 'Roster'
            : ROUTE_TITLES[lastSegment] || formatTitle(lastSegment);

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 lg:px-8 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 shrink-0">

            <h1 className="text-xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                {rawTitle}
            </h1>

            <div className="flex items-center gap-3">

                <button
                    title="Notifications"
                    className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>

                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50 box-content" />
                </button>

            </div>
        </header>
    );
}