import type { ReactNode } from "react";
import {
  AuthenticatedTopBar,
  type AuthenticatedTenantBranding,
} from "@/components/molecules/authenticated-top-bar";
import { SidebarNav } from "@/components/organisms/sidebar-nav";
import type { UserRole } from "@/lib/navigation-config";

interface AuthenticatedShellProps {
  children?: ReactNode;
  emptyState?: ReactNode;
  role: UserRole;
  tenantBranding?: AuthenticatedTenantBranding;
  userName?: string;
}

function ShellEmptyState({ role }: { role: UserRole }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 shadow-sm">
          <svg
            width="30"
            height="30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800">
          Main content placeholder
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Organisms will render here as they are built. Current role: {role}.
        </p>
      </div>
    </div>
  );
}

export function AuthenticatedShell({
  children,
  role,
  tenantBranding,
}: AuthenticatedShellProps) {
  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-slate-50">
      <SidebarNav role={role} tenant={tenantBranding} />

      <main className="flex-1 h-full overflow-y-auto relative flex flex-col">
        <AuthenticatedTopBar />

        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
