import { SkeletonForm } from "@/components/molecules/skeleton-shell";

export default function OfficerSettingsLoading() {
  return <SkeletonForm fields={5} className="mx-auto w-full max-w-4xl py-8" />;
}
