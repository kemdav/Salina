interface TenantPreviewBannerProps {
  tenantSlug: string | null;
}

export function TenantPreviewBanner({
  tenantSlug,
}: TenantPreviewBannerProps) {
  return (
    <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-lg shadow-emerald-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Preview Demo
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            This banner proves your branch deployed successfully.
          </h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100">
          Tenant: {tenantSlug ?? "public"}
        </div>
      </div>
    </section>
  );
}
