import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function MemberAttendanceLoading() {
  return (
    <SkeletonTable
      rows={5}
      columns={3}
      className="mx-auto max-w-3xl py-8"
    />
  );
}
