import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function MembersPageLoading() {
  return <SkeletonTable rows={5} columns={4} />;
}
