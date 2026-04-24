import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={error || props["aria-invalid"]}
        className={cn(
          "flex h-[46px] w-full rounded-(--radius) border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 text-sm text-foreground outline-none transition duration-200 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60",
          error &&
            "border-destructive focus:border-destructive focus:ring-destructive/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
