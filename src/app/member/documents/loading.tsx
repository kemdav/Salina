import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function MemberDocumentsLoading() {
  return (
    <SkeletonTable
      rows={5}
      columns={3}
      className="py-8"
    />
  );
}
