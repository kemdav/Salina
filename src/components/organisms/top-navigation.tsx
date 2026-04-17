import Link from 'next/link';

import { SalinaLogo } from '@/components/atoms/salina-logo';
import { NavLinks } from '@/components/molecules/nav-links';

export function TopNavigation() {
    return (
        <nav className="border-b border-border px-8 h-20 flex items-center justify-between sticky top-0 bg-background z-50">
            {/* Left: Logo Atom */}
            <div className="flex items-center">
                <SalinaLogo variant="light" width={110} />
            </div>

            {/* Center: Navigation Links Molecule */}
            <NavLinks />

            {/* Right: Auth Action (Atom) */}
            <div className="flex items-center gap-4">
                <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary text-white hover:bg-primary-hover active:opacity-90"
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}