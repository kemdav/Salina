import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import { getRoleHomePath, isRoleAtLeast } from "@/lib/roles";

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

  // Enforce role gate: only officer, admin, owner, and system_admin can access /officer/*
  if (!viewer.isPlatformAdmin && !isRoleAtLeast(viewer.tenantRole, "officer")) {
    const homePath = getRoleHomePath(viewer.tenantRole);
    redirect(homePath);
  }

  return (
    <AuthenticatedShell
      role="Officer"
      tenantBranding={{
        name: tenantContext.tenant.name,
        primaryColor:
          tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
        textColor: "#ffffff",
        logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
      }}
      userName={viewer.email?.split("@")[0] ?? "Officer"}
    >
      {children}
    </AuthenticatedShell>
  );
}
