import { SkeletonList } from "@/components/molecules/skeleton-shell";

export default function OfficerAttendanceLoading() {
  return (
    <SkeletonList
      count={4}
      className="mx-auto w-full max-w-6xl py-8"
    />
  );
}
