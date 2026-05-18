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
          {tenantContext.tenant ? (
            <section className="rounded-3xl border border-white/10 bg-stone-900/80 p-6 md:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
                Tenant theme config
              </h2>
              <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/5 bg-stone-950/70 p-4 text-xs leading-6 text-stone-200">
                {Object.keys(tenantContext.tenant.themeConfig || {}).length > 0
                  ? JSON.stringify(tenantContext.tenant.themeConfig, null, 2)
                  : "No theme configured."}
              </pre>
            </section>
          ) : null}
        </section>
      </main>
    </div>
  );
}
