'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SalinaLogo } from '@/components/ui/salina-logo';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-[family:var(--font-body)] text-foreground">

            {/* ── Navigation ── */}
            <nav className="border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-50">
                <div className="flex items-center gap-8">
                    <SalinaLogo variant="light" width={100} />
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Solutions</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Features</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Resources</Link>
                        <Link href="#" onClick={(e) => e.preventDefault()} className="hover:text-foreground transition-colors">Pricing</Link>
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
            <section className="px-6 py-16 lg:py-24 max-w-[var(--grid-max-width)] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[var(--grid-gutter)] items-center">
                <div className="max-w-2xl">
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] text-balance font-[family:var(--font-heading)]">
                        The Operating System for Organizations.
                    </h1>
                    <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed text-pretty">
                        From recruitment pipelines to governance modules — everything your organization needs to thrive, in one unified platform.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Button className="h-12 px-8 text-base">Get Started</Button>
                        <Button variant="secondary" className="h-12 px-8 text-base shadow-sm">Documentation</Button>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="aspect-video lg:aspect-square bg-[#f8fafc] border-2 border-dashed border-border rounded-[var(--radius)] flex items-center justify-center text-[var(--muted)] font-medium italic shadow-sm">
                    Product Preview Placeholder
                </div>
            </section>

            {/* ── Secondary Content Section ── */}
            <section className="px-6 py-20 max-w-[var(--grid-max-width)] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 aspect-video bg-[#f8fafc] border-2 border-dashed border-border rounded-[var(--radius)] flex items-center justify-center text-[var(--muted)] italic font-medium shadow-sm">
                    Feature Graphic Placeholder
                </div>
                <div className="order-1 lg:order-2 max-w-xl">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-balance font-[family:var(--font-heading)]">
                        Compliance built into every interaction.
                    </h2>
                    <p className="mt-5 text-[var(--muted)] leading-relaxed text-lg">
                        Our Policy Engine evaluates workflows in real-time, ensuring every decision aligns with the constitution and local regulations of your organization.
                    </p>
                    <ul className="mt-8 space-y-5">
                        {['Automated approval chains', 'Cryptographically signed IDs', 'Digital audit trails'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-base font-medium text-foreground">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="mt-auto border-t border-border py-10 px-6 bg-background">
                <div className="max-w-[var(--grid-max-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <SalinaLogo variant="light" width={80} />
                        <p className="text-xs text-[var(--muted)]">© 2026 KIRK LTD. ALL RIGHTS RESERVED.</p>
                    </div>
                    <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}