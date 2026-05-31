import { redirect } from "next/navigation";

import { AdminSettingsPanel } from "@/components/organisms/admin-settings-panel";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import { canAccessOrganizationSettings } from "@/lib/organization-permissions";

export default async function OfficerSettingsPage() {
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

  // Ensure they have permission to access settings
  if (!canAccessOrganizationSettings(viewer)) {
    redirect("/officer/dashboard");
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
