"use client";

import {
  SkeletonBox,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
} from "@/components/atoms/skeleton";

/**
 * Page-level skeleton templates that mirror the shape of real content.
 * Each template is designed to match a specific page layout pattern.
 */

// ─── Section Header ───────────────────────────────────────────

export function SkeletonPageHeader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`mb-8 space-y-2 ${className}`}
      aria-hidden="true"
    >
      <SkeletonText className="h-8 w-64" />
      <SkeletonText className="h-4 w-96 bg-slate-50" />
    </div>
  );
}

// ─── Stat Card Row ────────────────────────────────────────────

export function SkeletonStatRow({
  count = 5,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ─── Dashboard Sections ───────────────────────────────────────

export function SkeletonSection({
  className = "",
  bulletCount = 3,
}: {
  className?: string;
  bulletCount?: number;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      aria-hidden="true"
    >
      <SkeletonText className="mb-4 h-4 w-32" />
      <div className="space-y-3">
        {Array.from({ length: bulletCount }, (_, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-1.5">
              <SkeletonText className="h-4 w-3/4" />
              <SkeletonText className="h-3 w-full bg-slate-50" />
              <SkeletonText className="h-2 w-16 bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard({
  statCount = 5,
  sectionCount = 3,
}: {
  statCount?: number;
  sectionCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <SkeletonStatRow count={statCount} />
      </div>
      {Array.from({ length: sectionCount }, (_, i) => (
        <SkeletonSection key={i} />
      ))}
    </div>
  );
}

// ─── Feed / Announcements ─────────────────────────────────────

export function SkeletonFeed({
  count = 3,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <SkeletonPageHeader className="mb-8" />
      <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <SkeletonCircle className="h-9 w-9" />
              <div className="flex-1 space-y-2">
                <SkeletonText className="h-5 w-48" />
                <SkeletonText className="h-4 w-full bg-slate-50" />
                <SkeletonText className="h-4 w-3/4 bg-slate-50" />
                <div className="flex items-center gap-4 pt-1">
                  <SkeletonText className="h-3 w-20 bg-slate-50" />
                  <SkeletonText className="h-3 w-16 bg-slate-50" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <SkeletonPageHeader className="mb-6" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3">
          {Array.from({ length: columns }, (_, i) => (
            <SkeletonText key={i} className="h-4 w-20" />
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-4 px-6 py-3.5">
              {Array.from({ length: columns }, (_, j) => (
                <SkeletonText
                  key={j}
                  className={`h-4 ${
                    j === 0
                      ? "w-36"
                      : j === columns - 1
                        ? "w-16"
                        : "w-24"
                  } bg-slate-50`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── List (generic items) ─────────────────────────────────────

export function SkeletonList({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <SkeletonPageHeader className="mb-6" />
      <div className="space-y-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBox className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <SkeletonText className="h-4 w-40" />
                  <SkeletonText className="h-3 w-56 bg-slate-50" />
                </div>
              </div>
              <SkeletonText className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────

export function SkeletonForm({
  fields = 4,
  className = "",
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <SkeletonPageHeader className="mb-8" />
      <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          {Array.from({ length: fields }, (_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonText className="h-4 w-20" />
              <SkeletonBox className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <SkeletonBox className="h-10 w-24" />
            <SkeletonBox className="h-10 w-20 bg-slate-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ID Card ──────────────────────────────────────────────────

export function SkeletonIdCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-md ${className}`}
      aria-hidden="true"
    >
      <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* Photo area */}
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 p-6">
          <SkeletonBox className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <SkeletonText className="h-5 w-36" />
            <SkeletonText className="h-4 w-24 bg-slate-50" />
          </div>
        </div>
        {/* Info rows */}
        <div className="space-y-4 p-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center justify-between">
              <SkeletonText className="h-4 w-16 bg-slate-50" />
              <SkeletonText className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Full Page Landing ────────────────────────────────────────

export function SkeletonLanding() {
  return (
    <div className="min-h-screen bg-white" aria-hidden="true">
      {/* Nav */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <SkeletonBox className="h-8 w-24" />
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonText key={i} className="h-4 w-16 bg-slate-50" />
          ))}
          <SkeletonBox className="h-9 w-24 rounded-full" />
        </div>
      </div>
      {/* Hero */}
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <SkeletonText className="mx-auto h-10 w-3/4" />
        <SkeletonText className="mx-auto mt-4 h-5 w-1/2 bg-slate-50" />
        <div className="mt-8 flex justify-center gap-3">
          <SkeletonBox className="h-11 w-36 rounded-full" />
          <SkeletonBox className="h-11 w-36 rounded-full bg-slate-50" />
        </div>
      </div>
      {/* Grid sections */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} className="h-48">
              <div className="space-y-3">
                <SkeletonBox className="h-10 w-10 rounded-xl" />
                <SkeletonText className="h-5 w-32" />
                <SkeletonText className="h-4 w-full bg-slate-50" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Auth Card (centered form) ─────────────────────────────────

export function SkeletonAuthCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-sm ${className}`}
      aria-hidden="true"
    >
      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <SkeletonBox className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <SkeletonText className="h-4 w-16" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonText className="h-4 w-16" />
            <SkeletonBox className="h-10 w-full" />
          </div>
          <div className="pt-2">
            <SkeletonBox className="h-11 w-full rounded-full" />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <SkeletonText className="h-4 w-48 bg-slate-50" />
        </div>
      </div>
    </div>
  );
}
