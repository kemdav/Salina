'use client';

import { notFound } from 'next/navigation';
import { Button, TextInput, PasswordInput, Badge } from '@/components/ui';

// ---------------------------------------------------------------------------
// Color token data
// ---------------------------------------------------------------------------
const brandColors = [
  { name: '--color-primary',       hex: '#C6623E' },
  { name: '--color-primary-hover', hex: '#A84E2E' },
  { name: '--color-primary-light', hex: '#F5E6E0' },
  { name: '--color-secondary',     hex: '#95CDE0' },
  { name: '--color-accent',        hex: '#8A6ED4' },
  { name: '--color-neutral',       hex: '#FBF5F2' },
];

const semanticColors = [
  { name: '--color-destructive', hex: '#DC2626' },
  { name: '--color-success',     hex: '#16A34A' },
  { name: '--color-warning',     hex: '#D97706' },
  { name: '--color-muted',       hex: '#9CA3AF' },
];

const surfaceColors = [
  { name: '--color-surface-light', hex: '#FFFFFF' },
  { name: '--color-surface-dark',  hex: '#1A1A1A' },
];

// ---------------------------------------------------------------------------
// Spacing token data
// ---------------------------------------------------------------------------
const spacingTokens = [
  { label: '--spacing-1',  px: 4  },
  { label: '--spacing-2',  px: 8  },
  { label: '--spacing-3',  px: 12 },
  { label: '--spacing-4',  px: 16 },
  { label: '--spacing-6',  px: 24 },
  { label: '--spacing-8',  px: 32 },
  { label: '--spacing-10', px: 40 },
  { label: '--spacing-12', px: 48 },
  { label: '--spacing-16', px: 64 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="bg-(--color-surface-light) rounded-(--radius) p-(--card-padding) flex flex-col gap-6"
      style={{ padding: 'var(--card-padding)' }}
    >
      <h2
        className="text-xs font-semibold tracking-widest uppercase text-(--color-muted)"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function SwatchGroup({ label, swatches }: { label: string; swatches: { name: string; hex: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-(--color-surface-dark)">{label}</p>
      <div className="flex flex-wrap gap-4">
        {swatches.map(({ name, hex }) => (
          <div key={name} className="flex flex-col gap-2 items-start">
            <div
              className="w-20 h-20 rounded-(--radius) border border-black/10"
              style={{ backgroundColor: hex }}
            />
            <span className="text-xs font-mono text-(--color-surface-dark) leading-tight">{name}</span>
            <span className="text-xs font-mono text-(--color-muted)">{hex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function StyleGuidePage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <main
      className="min-h-screen bg-(--color-surface-light)"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          maxWidth: 'var(--grid-max-width)',
          paddingLeft: 'var(--grid-margin)',
          paddingRight: 'var(--grid-margin)',
          paddingTop: 'var(--spacing-12)',
          paddingBottom: 'var(--spacing-12)',
          gap: 'var(--spacing-12)',
        }}
      >
        {/* Page header */}
        <div>
          <h1
            className="font-bold text-(--color-surface-dark)"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-h1)' }}
          >
            Salina Design System
          </h1>
          <p className="mt-2 text-(--color-muted)" style={{ fontSize: 'var(--text-paragraph)' }}>
            Developer style-guide — tokens &amp; component reference
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 1. COLOR TOKENS                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Card title="1 — Color Tokens">
          <SwatchGroup label="Brand Colors"    swatches={brandColors}   />
          <SwatchGroup label="Semantic Colors" swatches={semanticColors} />
          <SwatchGroup label="Surface Colors"  swatches={surfaceColors}  />
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 2. TYPOGRAPHY                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Card title="2 — Typography">
          {[
            { tag: 'h1', label: 'H1 — Plus Jakarta Sans, 45px, Bold',    size: 'var(--text-h1)',        weight: '700' },
            { tag: 'h2', label: 'H2 — Plus Jakarta Sans, 35px, Bold',    size: 'var(--text-h2)',        weight: '700' },
            { tag: 'h3', label: 'H3 — Plus Jakarta Sans, 25px, SemiBold',size: 'var(--text-h3)',        weight: '600' },
            { tag: 'h4', label: 'H4 — Plus Jakarta Sans, 18px, Medium',  size: 'var(--text-h4)',        weight: '500' },
            { tag: 'h5', label: 'H5 — Plus Jakarta Sans, 16px, Medium',  size: 'var(--text-h5)',        weight: '500' },
            { tag: 'p',  label: 'Paragraph — Inter, 16px, Regular',      size: 'var(--text-paragraph)', weight: '400' },
          ].map(({ tag, label, size, weight }) => {
            const isHeading = tag !== 'p';
            return (
              <div key={tag} className="flex flex-col gap-1 border-b border-(--color-neutral) pb-4 last:border-0 last:pb-0">
                <span className="text-xs font-mono text-(--color-muted)">{label}</span>
                <p
                  className="text-(--color-surface-dark)"
                  style={{
                    fontFamily: isHeading ? 'var(--font-heading)' : 'var(--font-body)',
                    fontSize: size,
                    fontWeight: weight,
                    lineHeight: 1.2,
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            );
          })}
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 3. SPACING                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Card title="3 — Spacing">
          <div className="flex flex-col gap-3">
            {spacingTokens.map(({ label, px }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-xs font-mono text-(--color-muted) w-28 shrink-0">{label}</span>
                <div
                  className="h-5 rounded-sm bg-(--color-primary)"
                  style={{ width: px }}
                />
                <span className="text-xs font-mono text-(--color-muted)">{px}px</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 4. BUTTONS                                                        */}
        {/* ---------------------------------------------------------------- */}
        <Card title="4 — Buttons">
          {(['primary', 'secondary', 'ghost', 'destructive'] as const).map((variant) => (
            <div key={variant} className="flex flex-col gap-2">
              <span className="text-xs font-mono text-(--color-muted) capitalize">{variant}</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant} size="sm">Small</Button>
                <Button variant={variant} size="md">Medium</Button>
                <Button variant={variant} size="lg">Large</Button>
                <Button variant={variant} size="md" disabled>Disabled</Button>
              </div>
            </div>
          ))}
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 5. TEXT INPUTS                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Card title="5 — Text Inputs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Default</span>
              <TextInput label="Email" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Focus (click to see)</span>
              <TextInput label="Email" placeholder="you@example.com" autoFocus />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Error</span>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                defaultValue="not-an-email"
                errorMessage="Please enter a valid email address."
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Disabled</span>
              <TextInput label="Email" placeholder="you@example.com" disabled />
            </div>
          </div>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 6. PASSWORD INPUT                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Card title="6 — Password Input">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Hidden (default)</span>
              <PasswordInput label="Password" placeholder="Enter password" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono text-(--color-muted) mb-1">Revealed (toggle icon to see)</span>
              <PasswordInput label="Password" placeholder="Enter password" defaultValue="s3cr3tP@ss!" />
            </div>
          </div>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* 7. BADGES                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Card title="7 — Badges">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge variant="accent">Accent</Badge>
          </div>
        </Card>
      </div>
    </main>
  );
}
