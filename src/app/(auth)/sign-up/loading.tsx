import { SkeletonAuthCard } from "@/components/molecules/skeleton-shell";

export default function SignUpLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SkeletonAuthCard />
    </div>
  );
}
