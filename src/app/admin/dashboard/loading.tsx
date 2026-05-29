import { SkeletonDashboard } from "@/components/molecules/skeleton-shell";

export default function AdminDashboardLoading() {
  return <SkeletonDashboard statCount={4} sectionCount={2} />;
}
