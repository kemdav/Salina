'use client';

import { SalinaLogo } from '@/components/atoms/salina-logo';

export function OnboardingHeader() {
    return (
        <nav
            aria-label="Onboarding header"
            className="border-b border-border px-8 h-20 flex items-center justify-between sticky top-0 bg-background z-50"
        >

            <div className="flex items-center">
                <SalinaLogo variant="light" width={110} />
            </div>

        </nav>
    );
}