'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SalinaLogo } from '@/components/ui/salina-logo';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
  }

  return (
    // Fixed overlay — visually escapes the (auth) split layout
    <div
      className="flex flex-col"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'var(--neutral)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── Centered card area ──────────────────────────────────────── */}
      <main
        className="flex-1 flex items-center justify-center"
        style={{ padding: '24px' }}
      >
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--surface-light)',
          borderRadius: '12px',
          padding: 'clamp(32px, 6vw, 48px)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.04)',
          boxSizing: 'border-box',
        }}>

          {/* Logo + divider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <SalinaLogo variant="light" width={100} />
            <div style={{ width: '40px', height: '1px', backgroundColor: '#E5E7EB', margin: '20px auto 0' }} />
          </div>

          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: 'color-mix(in srgb, var(--success) 12%, white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--foreground)' }}>
                  Check your inbox
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  We sent a reset link to your email address.
                </p>
              </div>
              <Link
                href="/login"
                className="transition-colors duration-200 hover:text-[var(--primary)]"
                style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-body)', marginTop: '4px' }}
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-heading)',
                fontSize: '26px', fontWeight: 700,
                color: 'var(--foreground)',
                textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.3px',
              }}>
                Reset password
              </h1>
              <p style={{
                margin: '0 0 28px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px', color: 'var(--muted)',
                textAlign: 'center', lineHeight: 1.6,
                maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto',
              }}>
                Enter your email and we&apos;ll send you a link to restore access.
              </p>

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="email" style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontSize: '12px',
                    fontWeight: 500, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: '#6B7280',
                    marginBottom: '6px',
                  }}>
                    Email Address
                  </label>
                  <input
                    id="email" type="email" aria-label="Email address"
                    placeholder="you@organization.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required
                    style={{
                      width: '100%', height: '46px',
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      borderRadius: 'var(--radius)',
                      border: '1.5px solid #E5E7EB',
                      padding: '0 14px', outline: 'none',
                      backgroundColor: '#F9FAFB', color: 'var(--foreground)',
                      boxSizing: 'border-box', transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198,98,62,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{
                    width: '100%', height: '48px',
                    backgroundColor: '#111111', color: 'white',
                    border: 'none', borderRadius: 'var(--radius)',
                    fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 600,
                    letterSpacing: '0.02em',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <p style={{ margin: '20px 0 0', textAlign: 'center' }}>
                <Link
                  href="/login"
                  className="transition-colors duration-200 hover:text-[var(--primary)]"
                  style={{ fontSize: '13px', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-body)' }}
                >
                  ← Back to sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '20px var(--spacing-8)',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--muted)',
      }}>
        <span>© 2026 KIRK LTD. ALL RIGHTS RESERVED.</span>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' },
            { label: 'Security', href: '/security' },
            { label: 'Status', href: '/status' },
          ].map(({ label, href }, i, arr) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center' }}>
              <a
                href={href}
                className="px-2 transition-colors duration-200 hover:text-[#4B5563]"
                style={{ color: 'var(--muted)', textDecoration: 'none' }}
              >
                {label}
              </a>
              {i < arr.length - 1 && (
                <span style={{ color: 'var(--muted)' }}>·</span>
              )}
            </span>
          ))}
        </nav>
      </footer>
    </div>
  );
}
