'use client';

import { cn } from "@/lib/utils";

const STEPS = [
    { id: 1, label: 'Details' },
    { id: 2, label: 'Branding' },
    { id: 3, label: 'Launch' }
];

export function StepIndicator({ currentStep = 1 }: { currentStep?: number }) {
    return (
        <div className="flex items-center w-full mb-10">
            {STEPS.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                        {/* Step Circle & Label */}
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200 border-2",
                                isActive ? "border-foreground bg-foreground text-background" :
                                    isCompleted ? "border-foreground bg-foreground text-background" :
                                        "border-border bg-background"
                            )} style={isActive || isCompleted ? undefined : { color: "var(--muted)" }}>
                                {isCompleted ? '✓' : step.id}
                            </div>
                            <span className={cn(
                                "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-200",
                                isActive || isCompleted ? "text-foreground" : ""
                            )} style={isActive || isCompleted ? undefined : { color: "var(--muted)" }}>
                                {step.label}
                            </span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <div className="flex-1 mx-4 transition-all duration-200 flex items-center justify-center">
                                <div className={cn(
                                    "w-full",
                                    isCompleted ? "bg-foreground" : "border-t-2 border-dotted border-border"
                                )} style={{ height: "2px" }} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}