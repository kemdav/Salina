import { SkeletonFeed } from "@/components/molecules/skeleton-shell";

export default function OfficerFeedLoading() {
  return <SkeletonFeed count={3} className="mx-auto w-full max-w-4xl py-8" />;
}
