import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "destructive" | "success";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    let variantClasses = "";

    switch (variant) {
      case "default":
        variantClasses = "bg-primary text-white border-transparent";
        break;
      case "destructive":
        variantClasses = "bg-destructive text-white border-transparent";
        break;
      case "success":
        variantClasses = "bg-success text-white border-transparent";
        break;
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${variantClasses} ${className}`}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
