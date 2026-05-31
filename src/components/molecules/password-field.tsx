"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

import { FieldMessage } from "@/components/atoms/field-message";
import { Input, type InputProps } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { cn } from "@/lib/utils";

interface PasswordFieldProps extends Omit<InputProps, "error" | "type"> {
  error?: string;
  helperText?: ReactNode;
  label: string;
  linkHref?: string;
  linkLabel?: string;
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return crossed ? (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" x2="23" y1="1" y2="23" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PasswordField({
  error,
  helperText,
  id,
  label,
  linkHref,
  linkLabel,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {linkHref && linkLabel ? (
          <Link
            className="text-xs text-[var(--muted)] transition duration-200 hover:text-primary"
            href={linkHref}
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <Input
          error={Boolean(error)}
          id={id}
          type={showPassword ? "text" : "password"}
          {...props}
          className={cn("pr-11", props.className)}
        />
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition duration-200 hover:text-foreground cursor-pointer"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          <EyeIcon crossed={showPassword} />
        </button>
      </div>
      {error ? (
        <FieldMessage role="alert" variant="error">
          {error}
        </FieldMessage>
      ) : helperText ? (
        <FieldMessage>{helperText}</FieldMessage>
      ) : null}
    </div>
  );
}
