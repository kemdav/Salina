import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-(--color-primary) text-white hover:bg-(--color-primary-hover) active:bg-(--color-primary-hover)',
  secondary:
    'bg-transparent text-(--color-primary) border border-(--color-primary) hover:bg-(--color-primary-light) active:bg-(--color-primary-light)',
  ghost:
    'bg-transparent text-(--color-primary) hover:bg-(--color-primary-light) active:bg-(--color-primary-light)',
  destructive:
    'bg-(--color-destructive) text-white hover:brightness-90 active:brightness-75',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-(--spacing-3) py-(--spacing-1) text-sm gap-(--spacing-1)',
  md: 'px-(--spacing-6) py-(--spacing-2) text-base gap-(--spacing-2)',
  lg: 'px-(--spacing-8) py-(--spacing-3) text-lg gap-(--spacing-2)',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-(--radius) transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        disabled ? 'opacity-50 pointer-events-none cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
