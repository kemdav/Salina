import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import {
  getRoleHomePath,
  getSwitchableRoles,
  isRoleAtLeast,
} from "@/lib/roles";
import type { UserRole } from "@/lib/navigation-config";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tenantContext = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!viewer || !tenantContext.tenant) {
    redirect("/login");
  }

  const status = tenantContext.tenant.status;
  if (status === "pending") {
    redirect("/pending");
  } else if (status === "suspended") {
    redirect("/suspended");
  } else if (status === "rejected") {
    redirect("/rejected");
  } else if (status === "inactive") {
    redirect("/inactive");
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
  const switchableRoles: UserRole[] = getSwitchableRoles(
    viewer.tenantRole,
    "Admin",
  );

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
        fontFamily: tenantContext.tenant.themeConfig.fontFamily ?? undefined,
      }}
      userName={viewer.displayName ?? viewer.email?.split("@")[0] ?? "Admin"}
      userId={viewer.id}
      tenantId={viewer.tenantId}
    >
      {children}
    </AuthenticatedShell>
  );
}
