import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          aria-invalid={error || props["aria-invalid"]}
          className={cn(
            "flex h-[46px] w-full appearance-none rounded-(--radius) border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 pr-10 text-sm text-foreground outline-none transition duration-200 cursor-pointer focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60",
            error &&
              "border-destructive focus:border-destructive focus:ring-destructive/10",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";

export { Select };
