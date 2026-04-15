import type { ReactNode } from "react";

import { AuthShell } from "@/components/organisms/auth-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex lg:flex-col"
        style={{
          width: '38%',
          backgroundColor: '#111111',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '40px' }}>
          <SalinaLogo variant="dark" width={110} />
        </div>

        {/* Vertically centered content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 48px',
        }}>
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '32px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            margin: 0,
          }}>
            Where organizations operate.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.45)',
            marginTop: '12px',
            lineHeight: 1.65,
            maxWidth: '260px',
            marginBottom: 0,
          }}>
            From recruitment to roster — everything your organization needs, in one place.
          </p>
        </div>
      </aside>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col"
        style={{ backgroundColor: '#FEFEFE' }}
      >
        {/* Centered content area */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{ padding: '24px 0' }}
        >
          <div style={{ width: '100%', maxWidth: '440px', padding: '0 24px' }}>
            {children}
          </div>
        </div>

        {/* Footer */}
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
          borderTop: '1px solid rgba(0,0,0,0.05)',
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
      </main>
    </div>
  );
}
