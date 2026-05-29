import { SkeletonTable } from "@/components/molecules/skeleton-shell";

export default function SuperAdminAdvisersLoading() {
  return <SkeletonTable rows={4} columns={4} />;
}
