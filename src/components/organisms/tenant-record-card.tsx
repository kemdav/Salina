import type { TenantContext } from "@/components/providers/tenant-provider";

import { DetailList } from "@/components/molecules/detail-list";
import { StatusBanner } from "@/components/molecules/status-banner";

interface TenantRecordCardProps {
  resolutionError: string | null;
  tenant: TenantContext["tenant"];
}

export function TenantRecordCard({
  resolutionError,
  tenant,
}: TenantRecordCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-stone-900/80 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
        Tenant record
      </h2>
      <div className="mt-5 space-y-4 text-sm text-stone-300">
        {tenant ? (
          <DetailList
            items={[
              {
                label: "Organization",
                value: tenant.name,
                valueClassName: "text-lg font-semibold text-white",
              },
              {
                label: "Slug",
                value: tenant.slug,
                valueClassName: "font-mono",
              },
              {
                label: "Plan",
                value: tenant.plan,
                valueClassName: "font-mono",
              },
              {
                label: "Organization type",
                value: tenant.organizationType ?? "Not set",
                valueClassName: "font-mono",
              },
              {
                label: "Billing email",
                value: tenant.billingEmail ?? "Not set",
                valueClassName: "font-mono",
              },
            ]}
          />
        ) : (
          <p className="leading-7 text-stone-300">
            No tenant record has been resolved yet. Configure the Supabase
            environment variables and visit a tenant host such as
            system-admin.localhost to confirm end-to-end resolution.
          </p>
        )}

        {resolutionError ? (
          <StatusBanner className="text-rose-200" tone="error">
            {resolutionError}
          </StatusBanner>
        ) : null}
      </div>
    </article>
  );
}
