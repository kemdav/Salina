'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button';
import { SalinaLogo } from '@/components/atoms/salina-logo';
import { NavLinks } from '@/components/molecules/nav-links';

export function TopNavigation() {

    const router = useRouter();

    return (
        <nav className="border-b border-border px-8 h-20 flex items-center justify-between sticky top-0 bg-background z-50">
            {/* Left: Logo Atom */}
            <div className="flex items-center">
                <SalinaLogo variant="light" width={110} />
            </div>

            {/* Center: Navigation Links Molecule */}
            <NavLinks />

            {/* Right: Auth Actions */}
            <div className="flex items-center gap-4">
                {/* Secondary action: Log In */}
                <Button
                    variant="secondary-2"
                    onClick={() => router.push('/login')}
                >
                    Log In
                </Button>

                {/* Primary action: Sign Up */}
                <Button
                    variant="primary-2"
                    onClick={() => router.push('/sign-up')}
                >
                    Sign Up
                </Button>
            </div>
        </nav>
    );
}