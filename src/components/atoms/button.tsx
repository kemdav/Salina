import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "dark";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", ...props }, ref) => {
    const variantClasses = {
      dark: "bg-[#111111] text-white hover:opacity-85 active:opacity-80",
      destructive:
        "bg-destructive text-white hover:opacity-90 active:opacity-80",
      ghost:
        "bg-transparent text-foreground hover:bg-slate-100 active:bg-slate-200",
      primary:
        "bg-primary text-white hover:bg-primary-hover active:opacity-90",
      secondary:
        "border border-[#E5E7EB] bg-white text-foreground hover:bg-slate-50 active:bg-slate-100",
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-60",
          variantClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
