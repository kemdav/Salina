'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Fields {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Minimum 8 characters.';
  }
  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#6B7280',
  marginBottom: '6px',
};

const errorStyle: React.CSSProperties = {
  marginTop: '4px',
  fontSize: '12px',
  color: 'var(--destructive)',
  fontFamily: 'var(--font-body)',
};

function inputStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: '46px',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    borderRadius: 'var(--radius)',
    border: `1.5px solid ${hasError ? 'var(--destructive)' : '#E5E7EB'}`,
    padding: '0 14px',
    outline: 'none',
    backgroundColor: '#F9FAFB',
    color: 'var(--foreground)',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  };
}

function focusHandlers(hasError: boolean) {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.borderColor = 'var(--primary)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198,98,62,0.1)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.backgroundColor = '#F9FAFB';
      e.currentTarget.style.borderColor = hasError ? 'var(--destructive)' : '#E5E7EB';
      e.currentTarget.style.boxShadow = 'none';
    },
  };
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function PasswordField({ id, label, value, onChange, error }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id} type={show ? 'text' : 'password'} aria-label={label}
          placeholder="••••••••" value={value} onChange={onChange}
          style={{ ...inputStyle(!!error), paddingRight: '44px' }}
          {...focusHandlers(!!error)}
        />
        <button type="button" onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const [fields, setFields] = useState<Fields>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function set(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  }

  return (
    <div>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '36px', fontWeight: 700,
        color: 'var(--foreground)', letterSpacing: '-0.5px',
        lineHeight: 1.15, margin: '0 0 6px',
      }}>
        Create account
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', margin: '0 0 32px' }}>
        Your organization. Your way.
      </p>

      {/* Google OAuth */}
      <button type="button"
        className="hover:opacity-80 transition-opacity duration-200"
        style={{
          width: '100%', height: '46px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          backgroundColor: 'white', border: '1.5px solid #E5E7EB',
          borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)',
          fontSize: '14px', fontWeight: 500, color: 'var(--foreground)',
          cursor: 'pointer',
        }}
      >
        <span style={{ width: '18px', height: '18px', borderRadius: '3px', backgroundColor: '#4285F4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>G</span>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
        Or email
        <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <label htmlFor="fullName" style={labelStyle}>Full Name</label>
          <input id="fullName" type="text" aria-label="Full name" placeholder="Alexander Salina"
            value={fields.fullName} onChange={set('fullName')}
            style={inputStyle(!!errors.fullName)} {...focusHandlers(!!errors.fullName)} />
          {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>Email Address</label>
          <input id="email" type="email" aria-label="Email address" placeholder="you@organization.com"
            value={fields.email} onChange={set('email')}
            style={inputStyle(!!errors.email)} {...focusHandlers(!!errors.email)} />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}
        </div>

        {/* Password row — two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          <PasswordField id="password" label="Password" value={fields.password} onChange={set('password')} error={errors.password} />
          <PasswordField id="confirmPassword" label="Confirm" value={fields.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        </div>

        {/* CTA */}
        <button type="submit" disabled={loading}
          className="hover:opacity-80 transition-opacity duration-200"
          style={{
            width: '100%', height: '48px', marginTop: '8px',
            backgroundColor: '#111111', color: 'white',
            border: 'none', borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600,
            letterSpacing: '0.02em', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p style={{ margin: '28px 0 0', textAlign: 'center', fontSize: '14px', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  );
}
