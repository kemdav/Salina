'use client';

import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-border py-10 px-8 bg-background">
            <div className="max-w-[var(--grid-max-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Left Side: Copyright */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <p className="text-xs text-[var(--muted)] font-medium">
                        © 2026 KIRK LTD. ALL RIGHTS RESERVED.
                    </p>
                </div>

                {/* Right Side: Links (Non-functional) */}
                <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    <Link
                        href="#"
                        className="pointer-events-none text-[var(--muted)]"
                        onClick={(e) => e.preventDefault()}
                    >
                        Privacy
                    </Link>
                    <Link
                        href="#"
                        className="pointer-events-none text-[var(--muted)]"
                        onClick={(e) => e.preventDefault()}
                    >
                        Terms
                    </Link>
                    <Link
                        href="#"
                        className="pointer-events-none text-[var(--muted)]"
                        onClick={(e) => e.preventDefault()}
                    >
                        Support
                    </Link>
                </div>

            </div>
        </footer>
    );
}