"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/atoms/scroll-reveal";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Responsive bento-style grid layout for dashboards.
 * 2-column on large screens, 1-column stacked on mobile.
 * Each child gets a scroll-reveal animation applied.
 */
export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 lg:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface DashboardSectionProps {
  children: ReactNode;
  title?: string;
  /** Makes this section span full width in the 2-col grid */
  fullWidth?: boolean;
  className?: string;
  delay?: number;
}

/**
 * A single dashboard card section with optional title.
 * Wraps children in a white card with border and shadow,
 * and applies a scroll-reveal animation on mount.
 */
export function DashboardSection({
  children,
  title,
  fullWidth = false,
  className,
  delay = 0,
}: DashboardSectionProps) {
  return (
    <ScrollReveal delay={delay} className={fullWidth ? "lg:col-span-2" : undefined}>
      <div
        className={cn(
          "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
          className,
        )}
      >
        {title && (
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            {title}
          </h2>
        )}
        {children}
      </div>
    </ScrollReveal>
  );
}

interface DashboardStatRowProps {
  children: ReactNode;
  className?: string;
}

/**
 * A row of stat cards that spans the full width.
 * Uses CSS grid for responsive stat card layout.
 */
export function DashboardStatRow({ children, className }: DashboardStatRowProps) {
  return (
    <ScrollReveal delay={0} className="lg:col-span-2">
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",
          className,
        )}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}
