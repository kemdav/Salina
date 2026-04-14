import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FieldMessageProps {
  children: ReactNode;
  className?: string;
  role?: "alert" | "status";
  variant?: "error" | "helper" | "success";
}

export function FieldMessage({
  children,
  className,
  role,
  variant = "helper",
}: FieldMessageProps) {
  return (
    <p
      className={cn(
        "mt-1 text-xs",
        variant === "error" && "text-destructive",
        variant === "helper" && "text-[var(--muted)]",
        variant === "success" && "text-success",
        className
      )}
      role={role}
    >
      {children}
    </p>
  );
}
