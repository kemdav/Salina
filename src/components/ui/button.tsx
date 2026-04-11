"use client";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", type = "button", ...props }, ref) => {
    let variantClasses = "";

    switch (variant) {
      case "primary":
        variantClasses =
          "bg-primary text-white hover:bg-primary-hover active:opacity-90 disabled:opacity-50 disabled:pointer-events-none";
        break;
      case "secondary":
        variantClasses =
          "bg-background border border-border text-foreground hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none";
        break;
      case "destructive":
        variantClasses =
          "bg-destructive text-white hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:pointer-events-none";
        break;
      case "ghost":
        variantClasses =
          "bg-transparent text-foreground hover:bg-slate-100 active:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none";
        break;
    }

    return (
      <button
        ref={ref}
        type={type}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${variantClasses} ${className}`}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
