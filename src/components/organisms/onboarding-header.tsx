'use client';

import { SalinaLogo } from '@/components/atoms/salina-logo';

interface OnboardingHeaderProps {
    currentStep?: number;
}

const STEP_LABELS: Record<number, string> = {
    1: 'Details',
    2: 'Branding',
    3: 'Pipeline',
    4: 'Launch'
};

export function OnboardingHeader({ currentStep = 1 }: OnboardingHeaderProps) {
    return (
        <nav className="border-b border-border px-8 h-20 flex items-center justify-between sticky top-0 bg-background z-50">

            <div className="flex items-center">
                <SalinaLogo variant="light" width={110} />
            </div>

            <div className="hidden md:flex items-center text-sm font-medium text-[var(--muted)]">
                Step 0{currentStep} of 04 /
                <span className="text-foreground ml-1 font-semibold">
                    {STEP_LABELS[currentStep] || 'Details'}
                </span>
            </div>

        </nav>
    );
}