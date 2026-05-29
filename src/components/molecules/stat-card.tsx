"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  /** Icon element (SVG or component) */
  icon: ReactNode;
  /** Accent color for the icon background, e.g. "bg-primary/10 text-primary" */
  iconClass?: string;
  /** Label displayed below the value */
  label: string;
  /** The main numeric or text value */
  value: string | number;
  /** Optional trend direction */
  trend?: TrendDirection;
  /** Optional trend description, e.g. "+12% from last month" */
  trendLabel?: string;
  className?: string;
}

const trendStyles: Record<TrendDirection, { arrow: string; color: string }> = {
  up: {
    arrow: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "text-emerald-600 bg-emerald-50",
  },
  down: {
    arrow: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
    color: "text-red-600 bg-red-50",
  },
  neutral: {
    arrow: "M5 12h14",
    color: "text-slate-500 bg-slate-100",
  },
};

export function StatCard({
  icon,
  iconClass = "bg-slate-100 text-slate-600",
  label,
  value,
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            iconClass,
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              trendStyles[trend].color,
            )}
            aria-label={trendLabel ?? `${trend} trend`}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
            >
              <path d={trendStyles[trend].arrow} />
            </svg>
            {trendLabel && <span>{trendLabel}</span>}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
