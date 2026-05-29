import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function OfficerRosterLoading() {
  return <SkeletonTable rows={6} columns={5} />;
}
