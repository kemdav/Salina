import { redirect } from "next/navigation";

import { AdminSettingsPanel } from "@/components/organisms/admin-settings-panel";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
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
    <AdminSettingsPanel
      tenant={{
        billingEmail: tenantContext.tenant.billingEmail,
        id: tenantContext.tenant.id,
        name: tenantContext.tenant.name,
        organizationType: tenantContext.tenant.organizationType,
        slug: tenantContext.tenant.slug,
        themeConfig: tenantContext.tenant.themeConfig ?? {},
      }}
    />
  );
}
