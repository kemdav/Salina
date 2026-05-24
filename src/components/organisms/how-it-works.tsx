"use client";

import { ScrollReveal } from "@/components/atoms/scroll-reveal";

const STEPS = [
    {
        number: "01",
        title: "Register Your Organization",
        description: "Sign up on the Salina platform and provision your organization's dedicated workspace in minutes. Choose your subdomain and configure basic details.",
        icon: "🏢",
    },
    {
        number: "02",
        title: "Brand Your Workspace",
        description: "Upload your logo, set your primary color palette, and choose your typography. Every member will see your org's identity — not a generic dashboard.",
        icon: "🎨",
    },
    {
        number: "03",
        title: "Invite Your Members",
        description: "Send invites to officers and members. Assign roles with the right access levels. Your org is live and fully operational from day one.",
        icon: "🚀",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="px-8 py-20 bg-slate-50/60 border-y border-border">
            <div className="max-w-[var(--grid-max-width)] mx-auto w-full">
                <ScrollReveal className="mb-16 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
                        Getting Started
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-[family:var(--font-heading)] text-balance">
                        Up and running in{" "}
                        <span className="text-primary">three steps.</span>
                    </h2>
                </ScrollReveal>

                {/* Desktop: horizontal connector line + cards */}
                <div className="relative">
                    {/* Connector line (desktop only) */}
                    <div className="hidden lg:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-border z-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative z-10">
                        {STEPS.map((step, i) => (
                            <ScrollReveal key={step.number} delay={i * 0.15} direction="up">
                                <div className="group flex flex-col items-center text-center lg:items-center">
                                    {/* Step number bubble */}
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-white shadow-md transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-xl group-hover:-translate-y-1">
                                        <span className="text-3xl">{step.icon}</span>
                                    </div>

                                    {/* Step indicator */}
                                    <span className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                        Step {step.number}
                                    </span>

                                    <h3 className="mb-3 text-xl font-bold text-foreground font-[family:var(--font-heading)]">
                                        {step.title}
                                    </h3>

                                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">
                                        {step.description}
                                    </p>

                                    {/* Mobile connector */}
                                    {i < STEPS.length - 1 && (
                                        <div className="lg:hidden mt-6 h-8 w-px bg-border" />
                                    )}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
