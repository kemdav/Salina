import {
  DashboardShell,
  DashboardStatRow,
  DashboardSection,
} from "@/components/templates/dashboard-shell";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-slate-100" />
        <div className="h-4 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 h-8 w-16 rounded bg-slate-100" />
      <div className="mt-1.5 h-3 w-24 rounded bg-slate-50" />
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-32 rounded bg-slate-100" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-50" />
              <div className="h-2 w-16 rounded bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardStatRow>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </DashboardStatRow>
      <SkeletonSection />
      <SkeletonSection />
      <DashboardSection title="Quick Actions" fullWidth>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-36 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </DashboardSection>
    </DashboardShell>
  );
}
