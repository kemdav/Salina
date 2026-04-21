'use client';

import { Button } from '@/components/atoms/button';

interface WizardFooterProps {
    onNext?: () => void;
    onBack?: () => void;
    disableNext?: boolean;
    disableBack?: boolean;
    nextLabel?: string;
    nextButtonType?: "button" | "submit";
}

export function WizardFooter({
    onNext,
    onBack,
    disableNext = false,
    disableBack = false,
    nextLabel = "Continue",
    nextButtonType = "button",
}: WizardFooterProps) {
    const handleNextClick = nextButtonType === "submit" ? undefined : onNext;

    return (
        <div className="flex items-center justify-between w-full pt-6 mt-8 border-t border-border">
            <Button
                type="button"
                variant="secondary"
                onClick={onBack}
                disabled={disableBack}
            >
                Back
            </Button>

            <Button
                type={nextButtonType}
                variant="primary"
                onClick={handleNextClick}
                disabled={disableNext}
            >
                {nextLabel}
            </Button>
        </div>
    );
}