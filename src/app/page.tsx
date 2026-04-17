import { redirect } from "next/navigation";

import { TenantContextCard } from "@/components/organisms/tenant-context-card";
import { TenantPreviewBanner } from "@/components/organisms/tenant-preview-banner";
import { TenantRecordCard } from "@/components/organisms/tenant-record-card";
import { TenantRuntimeHero } from "@/components/organisms/tenant-runtime-hero";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

export default async function Home() {
  const tenantContext = await resolveCurrentTenant();
  const viewer = tenantContext.tenant ? await getCurrentViewer() : null;

  if (tenantContext.tenant) {
    if (!viewer) {
      redirect("/login");
    }

    const canAccessTenant =
      viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

    if (!canAccessTenant) {
      redirect("/login");
    }
  }

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-12">
        <TenantRuntimeHero />

        <section className="grid gap-4 md:grid-cols-2">
          <TenantPreviewBanner tenantSlug={tenantContext.tenantSlug} />
          <TenantContextCard
            host={tenantContext.host}
            resolvedBy={tenantContext.resolvedBy}
            tenantSlug={tenantContext.tenantSlug}
          />
          <TenantRecordCard
            resolutionError={tenantContext.resolutionError}
            tenant={tenantContext.tenant}
          />
        </section>
      </main>
    </div>
  );
}
