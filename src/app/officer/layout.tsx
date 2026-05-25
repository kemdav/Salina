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

export default async function OfficerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tenantContext = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!viewer || !tenantContext.tenant) {
    redirect("/login");
  }

  const canAccessTenant =
    viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

  if (!canAccessTenant) {
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

  // Enforce role gate: only officer, admin, owner, and system_admin can access /officer/*
  // Also allow Members who have custom permissions assigned, since individual pages check specific permissions.
  const hasCustomPermissions = (viewer.customPermissions ?? []).length > 0;
  if (
    !viewer.isPlatformAdmin &&
    !isRoleAtLeast(viewer.tenantRole, "officer") &&
    !hasCustomPermissions
  ) {
    const homePath = getRoleHomePath(viewer.tenantRole);
    redirect(homePath);
  }

  // Compute switchable roles from the viewer's actual DB role (not the route group).
  const switchableRoles: UserRole[] = getSwitchableRoles(
    viewer.tenantRole,
    "Officer",
  );

  const displayRole = viewer.tenantRole === "member" ? "Member" : "Officer";

  return (
    <AuthenticatedShell
      role={displayRole}
      viewableRoles={switchableRoles}
      tenantBranding={{
        name: tenantContext.tenant.name,
        primaryColor:
          tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
        textColor: "#ffffff",
        logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
      }}
      userName={viewer.email?.split("@")[0] ?? "Officer"}
      customPermissions={viewer.customPermissions}
      userId={viewer.id}
      tenantId={viewer.tenantId}
    >
      {children}
    </AuthenticatedShell>
  );
}
