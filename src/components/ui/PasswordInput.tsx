'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextInput } from './TextInput';

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
