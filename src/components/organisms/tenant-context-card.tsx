import { DetailList } from "@/components/molecules/detail-list";

interface TenantContextCardProps {
  host: string | null;
  resolvedBy: string | null;
  tenantSlug: string | null;
}

export function TenantContextCard({
  host,
  resolvedBy,
  tenantSlug,
}: TenantContextCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-stone-900/80 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
        Request context
      </h2>
      <div className="mt-5">
        <DetailList
          items={[
            {
              label: "Host",
              value: host ?? "No host header",
              valueClassName: "font-mono",
            },
            {
              label: "Tenant slug header",
              value: tenantSlug ?? "No tenant slug resolved",
              valueClassName: "font-mono",
            },
            {
              label: "Resolved by",
              value: resolvedBy ?? "Not resolved",
              valueClassName: "font-mono",
            },
          ]}
        />
      </div>
    </article>
  );
}
