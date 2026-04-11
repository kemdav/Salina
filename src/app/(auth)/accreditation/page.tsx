'use client';

import { useState } from 'react';
import Link from 'next/link';

const ORG_TYPES = [
  'Business / Corporation',
  'Non-Profit Organization',
  'Association / Society',
  'Academic Institution',
  'Government Agency',
  'Other',
];

interface Fields {
  orgName: string;
  orgSlug: string;
  contactEmail: string;
  orgType: string;
}

interface Errors {
  orgName?: string;
  orgSlug?: string;
  contactEmail?: string;
  orgType?: string;
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-');
}

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.orgName.trim()) errors.orgName = 'Organization name is required.';
  if (!fields.orgSlug.trim()) {
    errors.orgSlug = 'Slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(fields.orgSlug)) {
    errors.orgSlug = 'Only lowercase letters, numbers, and hyphens allowed.';
  }
  if (!fields.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address.';
  }
  if (!fields.orgType) errors.orgType = 'Please select an organization type.';
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

const errorMsgStyle: React.CSSProperties = {
  marginTop: '4px', fontSize: '12px',
  color: 'var(--destructive)', fontFamily: 'var(--font-body)',
};

const helperMsgStyle: React.CSSProperties = {
  marginTop: '4px', fontSize: '12px',
  color: 'var(--muted)', fontFamily: 'var(--font-body)',
};

function inputStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: '100%', height: '46px',
    fontFamily: 'var(--font-body)', fontSize: '14px',
    borderRadius: 'var(--radius)',
    border: `1.5px solid ${hasError ? 'var(--destructive)' : '#E5E7EB'}`,
    padding: '0 14px', outline: 'none',
    backgroundColor: '#F9FAFB', color: 'var(--foreground)',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    appearance: 'none' as const,
  };
}

function focusHandlers(hasError: boolean) {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.borderColor = 'var(--primary)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198,98,62,0.1)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.currentTarget.style.backgroundColor = '#F9FAFB';
      e.currentTarget.style.borderColor = hasError ? 'var(--destructive)' : '#E5E7EB';
      e.currentTarget.style.boxShadow = 'none';
    },
  };
}

export default function AccreditationPage() {
  const [fields, setFields] = useState<Fields>({ orgName: '', orgSlug: '', contactEmail: '', orgType: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '16px 0' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--success) 12%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--foreground)' }}>
            Application submitted
          </h2>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '320px' }}>
            We&apos;ll review your application and contact{' '}
            <strong style={{ color: 'var(--foreground)' }}>{fields.contactEmail}</strong>{' '}
            within 2 business days.
          </p>
        </div>
        <Link href="/login" className="font-semibold hover:underline transition-colors duration-200" style={{ marginTop: '4px', fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Pre-title */}
      <p style={{ margin: '0 0 8px', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
        Accreditation Request
      </p>

      {/* Title */}
      <h1 style={{ margin: '0 0 6px', fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
        Apply to Salina
      </h1>
      <p style={{ margin: '0 0 32px', fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>
        Tell us about your organization. We&apos;ll review and respond within 2 business days.
      </p>

      {/* Server error */}
      {serverError && (
        <div role="alert" style={{
          marginBottom: '20px', padding: '12px 16px',
          backgroundColor: 'color-mix(in srgb, var(--destructive) 8%, white)',
          border: '1px solid color-mix(in srgb, var(--destructive) 25%, white)',
          borderRadius: 'var(--radius)', fontSize: '13px',
          color: 'var(--destructive)', fontFamily: 'var(--font-body)',
        }}>
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <label htmlFor="orgName" style={labelStyle}>Organization Name</label>
          <input id="orgName" type="text" aria-label="Organization name" placeholder="e.g. Apex Consulting"
            value={fields.orgName} onChange={(e) => set('orgName', e.target.value)}
            style={inputStyle(!!errors.orgName)} {...focusHandlers(!!errors.orgName)} />
          {errors.orgName && <p style={errorMsgStyle}>{errors.orgName}</p>}
        </div>

        <div>
          <label htmlFor="orgSlug" style={labelStyle}>Organization Slug</label>
          <input id="orgSlug" type="text" aria-label="Organization slug" placeholder="your-slug"
            value={fields.orgSlug} onChange={(e) => set('orgSlug', toSlug(e.target.value))}
            style={inputStyle(!!errors.orgSlug)} {...focusHandlers(!!errors.orgSlug)} />
          {errors.orgSlug ? (
            <p style={errorMsgStyle}>{errors.orgSlug}</p>
          ) : (
            <p style={helperMsgStyle}>salina.app/<strong>{fields.orgSlug || 'your-slug'}</strong></p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" style={labelStyle}>Contact Email</label>
          <input id="contactEmail" type="email" aria-label="Contact email" placeholder="admin@organization.com"
            value={fields.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
            style={inputStyle(!!errors.contactEmail)} {...focusHandlers(!!errors.contactEmail)} />
          {errors.contactEmail && <p style={errorMsgStyle}>{errors.contactEmail}</p>}
        </div>

        <div>
          <label htmlFor="orgType" style={labelStyle}>Type of Organization</label>
          <div style={{ position: 'relative' }}>
            <select id="orgType" aria-label="Type of organization" value={fields.orgType}
              onChange={(e) => set('orgType', e.target.value)}
              style={{ ...inputStyle(!!errors.orgType), paddingRight: '36px', cursor: 'pointer' }}
              {...focusHandlers(!!errors.orgType)}
            >
              <option value="" disabled>Select type</option>
              {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9CA3AF' }} aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {errors.orgType && <p style={errorMsgStyle}>{errors.orgType}</p>}
        </div>

        <button type="submit" disabled={loading}
          style={{
            width: '100%', height: '48px', marginTop: '8px',
            backgroundColor: '#111111', color: 'white',
            border: 'none', borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600,
            letterSpacing: '0.02em', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'all 0.2s ease',
          }}
          className="hover:opacity-80 transition-opacity duration-200"
        >
          {loading ? 'Submitting...' : 'Submit application'}
        </button>
      </form>

      <p style={{ margin: '28px 0 0', textAlign: 'center', fontSize: '14px', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold hover:underline transition-colors duration-200" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
      </p>
    </div>
  );
}
