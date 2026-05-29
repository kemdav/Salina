import { SkeletonForm } from "@/components/molecules/skeleton-shell";

export default function SuperAdminSettingsLoading() {
  return (
    <SkeletonForm
      fields={4}
      className="mx-auto w-full max-w-5xl py-8"
    />
  );
}
