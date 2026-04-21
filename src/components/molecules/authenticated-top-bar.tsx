import { SalinaLogo } from '@/components/atoms/salina-logo';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/navigation-config';

export interface AuthenticatedTenantBranding {
    name: string;
    primaryColor: string;
    textColor: string;
    logo?: string;
}

interface AuthenticatedTopBarProps {
    role: UserRole;
    tenantBranding?: AuthenticatedTenantBranding;
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

export function AuthenticatedTopBar({
    role,
    tenantBranding,
    userName = 'Jane Doe',
}: AuthenticatedTopBarProps) {
    const workspaceName = tenantBranding?.name ?? 'Workspace';
    const workspaceInitial = workspaceName.trim().slice(0, 1).toUpperCase() || 'W';
    const userInitials = getInitials(userName);

    return (
        <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur sm:px-8">
            <div className="flex min-w-0 items-center gap-4">
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                    style={tenantBranding ? { backgroundColor: tenantBranding.primaryColor } : undefined}
                >
                    {tenantBranding?.logo ? (
                        <div
                            className="h-full w-full bg-center bg-cover bg-no-repeat"
                            style={{ backgroundImage: `url(${tenantBranding.logo})` }}
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
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className={cn(
                        'relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors',
                        'hover:bg-slate-50 hover:text-slate-700',
                    )}
                    aria-label="Notifications"
                >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-rose-500" />
                </button>

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