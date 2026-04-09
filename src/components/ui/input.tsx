'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ---------------------------------------------------------------------------
// TextInput
// ---------------------------------------------------------------------------

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

export function TextInput({
  label,
  placeholder,
  errorMessage,
  disabled,
  id,
  className = '',
  ...props
}: TextInputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex flex-col gap-(--spacing-1) font-(family-name:--font-body)">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-(--color-surface-dark)"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        className={[
          'w-full rounded-(--radius) border px-(--spacing-3) py-(--spacing-2) text-base outline-none transition-colors',
          'bg-(--color-neutral) text-(--color-surface-dark) placeholder:text-(--color-muted)',
          hasError
            ? 'border-(--color-destructive) focus:ring-2 focus:ring-(--color-destructive)/30'
            : 'border-(--color-muted) focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {hasError && (
        <span
          id={`${inputId}-error`}
          className="text-sm text-(--color-destructive)"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PasswordInput
// ---------------------------------------------------------------------------

type PasswordInputProps = Omit<React.ComponentPropsWithoutRef<typeof TextInput>, 'type'>;

export function PasswordInput({ disabled, label, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="flex flex-col gap-(--spacing-1) font-(family-name:--font-body)">
      {label && (
        <label className="text-sm font-medium text-(--color-surface-dark)">
          {label}
        </label>
      )}
      <div className="relative">
        <TextInput
          {...props}
          label={undefined}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-hidden={disabled ? true : undefined}
          tabIndex={disabled ? -1 : undefined}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className={[
            'absolute right-(--spacing-3) top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-surface-dark) transition-colors',
            disabled ? 'pointer-events-none' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icon size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
