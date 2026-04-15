'use client';

import { Button } from '@/components/atoms/button';
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
                <Button onClick={(e) => e.preventDefault()}>
                    Get Started
                </Button>
            </div>
        </nav>
    );
}