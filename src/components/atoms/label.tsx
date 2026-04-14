import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-medium uppercase tracking-[0.06em] text-[#6B7280]",
        className
      )}
      {...props}
    />
  );
}
