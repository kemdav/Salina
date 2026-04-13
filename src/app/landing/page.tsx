'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SalinaLogo } from '@/components/ui/salina-logo';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>

            {/* ── Navigation ── */}
            <nav className="border-b border-[var(--border)] px-6 h-16 flex items-center justify-between sticky top-0 bg-[var(--background)] z-50">
                <div className="flex items-center gap-8">
                    <SalinaLogo variant="light" width={100} />
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--foreground)] transition-colors">Solutions</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--foreground)] transition-colors">Features</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--foreground)] transition-colors">Resources</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--foreground)] transition-colors">Pricing</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* <Link href="/login">
                        <Button variant="ghost">Sign in</Button>
                    </Link> 
                    */}
                    <Link href="/sign-up">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="px-6 py-16 lg:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                        The Operating System for Organizations.
                    </h1>
                    <p className="mt-6 text-lg text-[var(--muted)] max-w-lg leading-relaxed">
                        From recruitment pipelines to governance modules — everything your organization needs to thrive, in one unified platform.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button className="h-12 px-8 text-base">Request Demo</Button>
                        <Button variant="secondary" className="h-12 px-8 text-base">Explore Features</Button>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="aspect-video lg:aspect-square bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-medium italic">
                    Product Preview Placeholder
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="border-y border-[var(--border)] bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="text-center sm:text-left">
                        <p className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-heading)' }}>99.9%</p>
                        <p className="text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Uptime SLA</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-heading)' }}>200+</p>
                        <p className="text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Organizations</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-3xl font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--font-heading)' }}>50k+</p>
                        <p className="text-sm text-[var(--muted)] uppercase tracking-wider mt-1">Daily Users</p>
                    </div>
                </div>
            </section>

            {/* ── Secondary Content Section ── */}
            <section className="px-6 py-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 italic font-medium">
                    Feature Graphic Placeholder
                </div>
                <div className="order-1 lg:order-2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Compliance built into every interaction.
                    </h2>
                    <p className="mt-4 text-[var(--muted)] leading-relaxed text-lg">
                        Our Policy Engine evaluates workflows in real-time, ensuring every decision aligns with  constitution and local regulations of your organization.
                    </p>
                    <ul className="mt-8 space-y-4">
                        {['Automated approval chains', 'Cryptographically signed IDs', 'Digital audit trails'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm font-medium text-[var(--foreground)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="mt-auto border-t border-[var(--border)] py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <SalinaLogo variant="light" width={80} />
                        <p className="text-xs text-[var(--muted)]">© 2026 KIRK LTD. ALL RIGHTS RESERVED.</p>
                    </div>
                    <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                        <Link href="#" className="hover:text-[var(--primary)] transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-[var(--primary)] transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-[var(--primary)] transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}