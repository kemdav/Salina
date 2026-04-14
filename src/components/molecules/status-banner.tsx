import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatusBannerProps {
  children: ReactNode;
  className?: string;
  tone?: "error" | "info" | "success";
}

export function StatusBanner({
  children,
  className,
  tone = "info",
}: StatusBannerProps) {
  const toneClasses = {
    error: "border border-rose-500/30 bg-rose-500/10 text-rose-700",
    info: "border border-white/10 bg-white/5 text-stone-100",
    success: "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
  }[tone];

  return (
    <div
      className={cn("rounded-2xl px-4 py-3 text-sm leading-6", toneClasses, className)}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
