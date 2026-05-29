import { SkeletonList } from "@/components/molecules/skeleton-shell";

export default function AdminRecruitmentEntryLoading() {
  return (
    <SkeletonList
      count={5}
      className="mx-auto w-full max-w-6xl py-8"
    />
  );
}
