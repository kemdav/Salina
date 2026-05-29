import { SkeletonDashboard } from "@/components/molecules/skeleton-shell";

export default function SuperAdminDashboardLoading() {
  return <SkeletonDashboard statCount={4} sectionCount={2} />;
}
