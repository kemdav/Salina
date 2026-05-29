import { SkeletonForm } from "@/components/molecules/skeleton-shell";

export default function AdminRecruitmentSettingsLoading() {
  return (
    <SkeletonForm
      fields={4}
      className="mx-auto w-full max-w-4xl py-8"
    />
  );
}
