import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

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

  const canAccessTenant =
    viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

  if (!canAccessTenant) {
    redirect("/login");
  }

  return (
    <AuthenticatedShell
      role="Admin"
      tenantBranding={{
        name: tenantContext.tenant.name,
        primaryColor:
          tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
        textColor: "#ffffff",
        logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
      }}
      userName={viewer.email?.split("@")[0] ?? "Admin"}
    >
      {children}
    </AuthenticatedShell>
  );
}
