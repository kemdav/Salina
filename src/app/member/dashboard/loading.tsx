import {
  DashboardShell,
  DashboardStatRow,
  DashboardSection,
} from "@/components/templates/dashboard-shell";
import { SkeletonCard } from "@/components/atoms/skeleton";
import { SkeletonSection } from "@/components/molecules/skeleton-shell";

export default function MemberDashboardLoading() {
  return (
    <DashboardShell>
      <DashboardStatRow>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </DashboardStatRow>
      <SkeletonSection />
      <SkeletonSection />
      <SkeletonSection />
      <DashboardSection title="Quick Actions" fullWidth>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
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
