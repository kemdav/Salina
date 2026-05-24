import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import { getRoleHomePath, getSwitchableRoles, isRoleAtLeast } from "@/lib/roles";
import type { UserRole } from "@/lib/navigation-config";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tenantContext = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!viewer || !tenantContext.tenant) {
    if (
      tenantContext.resolutionError === "This organization has been suspended."
    ) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-50">
          <div className="text-center p-8 border border-red-900/30 rounded-xl bg-red-950/10">
            <h1 className="mb-4 text-3xl font-bold text-red-500">
              Organization Suspended
            </h1>
            <p className="text-stone-300">
              Your organization&apos;s access has been temporarily suspended.
            </p>
            <p className="mt-2 text-stone-500 text-sm">
              Please contact the platform administrator for assistance.
            </p>
          </div>
        </div>
      );
    }
    redirect("/login");
  }

  const canAccessTenant =
    viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

  if (!canAccessTenant) {
    redirect("/login");
  }

  // Enforce role gate: only owner, admin, and system_admin (platform admin) can access /admin/*
  if (!viewer.isPlatformAdmin && !isRoleAtLeast(viewer.tenantRole, "admin")) {
    const homePath = getRoleHomePath(viewer.tenantRole);
    redirect(homePath);
  }

  // Compute switchable roles from the viewer's actual DB role (not the route group).
  const switchableRoles: UserRole[] = getSwitchableRoles(viewer.tenantRole, "Admin");

  return (
    <AuthenticatedShell
      role="Admin"
      viewableRoles={switchableRoles}
      tenantBranding={{
        name: tenantContext.tenant.name,
        primaryColor:
          tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
        textColor: "#ffffff",
        logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
      }}
      userName={viewer.email?.split("@")[0] ?? "Admin"}
      userId={viewer.id}
      tenantId={viewer.tenantId}
    >
      {children}
    </AuthenticatedShell>
  );
}
