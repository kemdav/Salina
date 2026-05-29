/**
 * The /member/discover page is a redirect, so this loading state
 * is unlikely to be seen. Included for completeness.
 */
import { SkeletonText, SkeletonBox } from "@/components/atoms/skeleton";

export default function MemberDiscoverLoading() {
  return (
    <div className="flex h-64 items-center justify-center" aria-hidden="true">
      <div className="space-y-3 text-center">
        <SkeletonBox className="mx-auto h-10 w-10 rounded-full" />
        <SkeletonText className="mx-auto h-4 w-48" />
      </div>
    </div>
  );
}
