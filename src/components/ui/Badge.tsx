import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'muted' | 'accent';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:     'text-(--color-primary)     bg-(--color-primary)/15',
  success:     'text-(--color-success)     bg-(--color-success)/15',
  warning:     'text-(--color-warning)     bg-(--color-warning)/15',
  destructive: 'text-(--color-destructive) bg-(--color-destructive)/15',
  muted:       'text-(--color-muted)       bg-(--color-muted)/15',
  accent:      'text-(--color-accent)      bg-(--color-accent)/15',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-(--spacing-3) py-(--spacing-1)',
        'rounded-(--radius-full) text-[14px] font-medium font-(family-name:--font-body)',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
