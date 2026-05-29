import { SkeletonList } from "@/components/molecules/skeleton-shell";

export default function MemberApplicationsLoading() {
  return (
    <SkeletonList
      count={3}
      className="mx-auto w-full max-w-5xl py-8"
    />
  );
}
