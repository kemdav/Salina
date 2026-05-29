import { SkeletonIdCard } from "@/components/molecules/skeleton-shell";

export default function MemberIdLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl py-16">
      <SkeletonIdCard />
    </div>
  );
}
