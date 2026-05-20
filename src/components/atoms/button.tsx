import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "dark"
    | "primary-2"
    | "secondary-2"
    | "destructive-2"
    | "dark-2";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", variant = "primary", ...props }, ref) => {
    const tactileLight =
      "shadow-md active:translate-y-0.5 active:shadow-sm active:scale-[0.98]";

    // Solid colored buttons
    const tactilePrimary =
      "shadow-md shadow-primary/40 active:translate-y-0.5 active:shadow-sm active:scale-[0.98]";
    const tactileDark =
      "shadow-md shadow-black/40 active:translate-y-0.5 active:shadow-sm active:scale-[0.98]";
    const tactileDestructive =
      "shadow-md shadow-destructive/40 active:translate-y-0.5 active:shadow-sm active:scale-[0.98]";

    const variantClasses = {
      // --- FLAT VARIANTS ---
      dark: "bg-[#111111] text-white hover:opacity-85 active:opacity-80",
      destructive:
        "bg-destructive text-white hover:opacity-90 active:opacity-80",
      ghost:
        "bg-transparent text-foreground hover:bg-slate-100 active:bg-slate-200",
      primary: "bg-primary text-white hover:bg-primary-hover active:opacity-90",
      secondary:
        "border border-[#E5E7EB] bg-white text-foreground hover:bg-slate-50 active:bg-slate-100",

      // --- TACTILE VARIANTS ---
      "dark-2": `bg-[#111111] text-white hover:opacity-85 ${tactileDark}`,
      "destructive-2": `bg-destructive text-white hover:opacity-90 ${tactileDestructive}`,
      "primary-2": `bg-primary text-white hover:bg-primary-hover ${tactilePrimary}`,
      "secondary-2": `border border-[#E5E7EB] bg-white text-foreground hover:bg-slate-50 ${tactileLight}`,
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-(--radius) px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
