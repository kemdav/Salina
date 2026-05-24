"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { ScrollReveal } from "@/components/atoms/scroll-reveal";

const ALL_FEATURES = [
    "Unlimited members",
    "Multi-tenant workspace",
    "Custom branding & colors",
    "Role-based access control",
    "Recruitment pipeline",
    "Event management & calendar",
    "Adviser verification workflow",
    "Organization feed",
    "Accreditation management",
    "Audit logs",
];

const CHECK_ICON = (
    <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        className="shrink-0 mt-0.5"
    >
        <path d="M5 13l4 4L19 7" />
    </svg>
);

export function PricingSection() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <section id="pricing" className="px-8 py-20 max-w-[var(--grid-max-width)] mx-auto w-full">
            <ScrollReveal className="mb-12 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
                    Pricing
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-[family:var(--font-heading)] text-balance">
                    One plan.{" "}
                    <span className="text-primary">Everything included.</span>
                </h2>
                <p className="mt-4 text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
                    No tiers, no feature gates. Pay once and your organization gets access to the full Salina platform.
                </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
                <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-foreground text-background p-10 shadow-xl">
                    {/* Price */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-background/50 mb-3">
                                Salina Platform
                            </p>
                            <div className="flex items-end gap-2">
                                <span className="text-6xl font-bold font-[family:var(--font-heading)] text-background">
                                    $29
                                </span>
                                <span className="text-base text-background/50 mb-2">/ month per org</span>
                            </div>
                            <p className="mt-3 text-sm text-background/60 max-w-xs leading-relaxed">
                                Everything your organization needs, unlocked from day one. No hidden fees. Cancel any time.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            className="h-12 px-8 text-base shrink-0"
                            onClick={() => { if (mounted) router.push("/sign-up"); }}
                        >
                            Get Started →
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-background/10 mb-8" />

                    {/* Feature grid */}
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-background/50 mb-5">
                        Everything included
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_FEATURES.map((feat) => (
                            <li key={feat} className="flex items-start gap-2.5 text-sm text-background/85">
                                <span className="text-primary-light">{CHECK_ICON}</span>
                                {feat}
                            </li>
                        ))}
                    </ul>
                </div>
            </ScrollReveal>
        </section>
    );
}
