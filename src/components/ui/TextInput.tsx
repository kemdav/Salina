import React from 'react';

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
