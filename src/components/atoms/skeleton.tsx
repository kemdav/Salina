"use client";

/**
 * Reusable skeleton primitives for loading.tsx pages.
 * Uses Tailwind's animate-pulse for shimmer effect — consistent
 * with the existing officer dashboard skeleton pattern.
 *
 * All components accept className for customization.
 */

// ─── Generic Shapes ───────────────────────────────────────────

export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  className = "h-4 w-3/4",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCircle({
  className = "h-10 w-10",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse shrink-0 rounded-full bg-slate-100 ${className}`}
      aria-hidden="true"
    />
  );
}

// ─── Card Skeleton ────────────────────────────────────────────

export function SkeletonCard({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      aria-hidden="true"
    >
      {children ?? (
        <>
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-10 w-10" />
            <SkeletonText className="h-4 w-16" />
          </div>
          <SkeletonText className="mt-3 h-8 w-20" />
          <SkeletonText className="mt-1.5 h-3 w-24 bg-slate-50" />
        </>
      )}
    </div>
  );
}
