'use client';

import { Button } from '@/components/atoms/button';

interface WizardFooterProps {
    onNext?: () => void;
    onBack?: () => void;
    disableNext?: boolean;
    disableBack?: boolean;
    nextLabel?: string;
}

export function WizardFooter({
    onNext,
    onBack,
    disableNext = false,
    disableBack = false,
    nextLabel = "Continue"
}: WizardFooterProps) {
    return (
        <div className="flex items-center justify-between w-full pt-6 mt-8 border-t border-border">
            <Button
                variant="secondary-2"
                onClick={onBack}
                disabled={disableBack}
            >
                Back
            </Button>

            <Button
                variant="primary-2"
                onClick={onNext}
                disabled={disableNext}
            >
                {nextLabel}
            </Button>
        </div>
    );
}