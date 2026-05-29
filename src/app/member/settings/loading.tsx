import { SkeletonForm } from "@/components/molecules/skeleton-shell";

export default function MemberSettingsLoading() {
  return (
    <SkeletonForm
      fields={3}
      className="mx-auto max-w-2xl py-8"
    />
  );
}
