import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function SuperAdminOrganizationsLoading() {
  return <SkeletonTable rows={5} columns={5} />;
}
