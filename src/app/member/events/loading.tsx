import { SkeletonList } from "@/components/molecules/skeleton-shell";

export default function MemberEventsLoading() {
  return (
    <SkeletonList
      count={3}
      className="mx-auto w-full max-w-6xl py-8"
    />
  );
}
