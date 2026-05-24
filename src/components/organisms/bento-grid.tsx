"use client";

import { ScrollReveal } from "@/components/atoms/scroll-reveal";

/* Inline SVG icon wrapper — matches the stroke style used throughout nav config */
function Icon({ children }: { children: React.ReactNode }) {
    return (
        <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
        >
            {children}
        </svg>
    );
}

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    /** Tailwind bg+text classes for the icon container, e.g. "bg-primary/10 text-primary" */
    iconClass: string;
    /** Tailwind gradient start class, e.g. "from-primary/5" */
    gradientFrom: string;
    /** Arbitrary shadow class for hover glow */
    glowClass: string;
    /** col-span classes per breakpoint */
    span: string;
}

const FEATURES: Feature[] = [
    {
        title: "Multi-Tenant Architecture",
        description:
            "Every organization gets its own isolated workspace — custom subdomain, data, and config — without shared infrastructure risk.",
        icon: (
            <Icon>
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </Icon>
        ),
        iconClass: "bg-primary/10 text-primary",
        gradientFrom: "from-primary/5",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--primary)_22%,transparent)]",
        span: "md:col-span-2 lg:col-span-2",
    },
    {
        title: "Role-Based Access Control",
        description:
            "Define granular permissions for Super Admins, Org Admins, Officers, and Members. Every action is gated to the right role.",
        icon: (
            <Icon>
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </Icon>
        ),
        iconClass: "bg-accent/10 text-accent",
        gradientFrom: "from-accent/5",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--accent)_22%,transparent)]",
        span: "lg:col-span-1",
    },
    {
        title: "Custom Branding",
        description:
            "Upload logos, set brand colors, and choose typography. Your org's workspace reflects your identity — not ours.",
        icon: (
            <Icon>
                <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </Icon>
        ),
        iconClass: "bg-secondary/30 text-primary",
        gradientFrom: "from-secondary/10",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--secondary)_30%,transparent)]",
        span: "lg:col-span-1",
    },
    {
        title: "Recruitment Pipeline",
        description:
            "Kanban-style applicant tracking from application to deliberation. Move candidates through stages with one click.",
        icon: (
            <Icon>
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </Icon>
        ),
        iconClass: "bg-success/10 text-success",
        gradientFrom: "from-success/5",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--success)_22%,transparent)]",
        span: "lg:col-span-1",
    },
    {
        title: "Event Management",
        description:
            "Create, schedule, and track attendance for org events. List view and calendar view included out of the box.",
        icon: (
            <Icon>
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </Icon>
        ),
        iconClass: "bg-warning/10 text-warning",
        gradientFrom: "from-warning/5",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--warning)_22%,transparent)]",
        span: "lg:col-span-1",
    },
    {
        title: "Adviser Verification",
        description:
            "Built-in workflow for submitting, reviewing, and approving advisers across the platform — no email threads needed.",
        icon: (
            <Icon>
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </Icon>
        ),
        iconClass: "bg-primary/10 text-primary",
        gradientFrom: "from-primary/5",
        glowClass: "hover:shadow-[0_20px_40px_-8px_color-mix(in_srgb,var(--primary)_22%,transparent)]",
        span: "md:col-span-2 lg:col-span-2",
    },
];

function BentoCard({ feature, delay }: { feature: Feature; delay: number }) {
    return (
        <ScrollReveal delay={delay} className={`group ${feature.span}`}>
            <div
                className={`
                    h-full rounded-2xl border border-border p-7 shadow-sm
                    bg-gradient-to-br ${feature.gradientFrom} to-white
                    transition-all duration-300
                    hover:-translate-y-1.5 hover:border-transparent
                    ${feature.glowClass}
                    cursor-default
                `}
            >
                <div
                    className={`
                        mb-5 inline-flex h-12 w-12 items-center justify-center
                        rounded-xl shadow-sm transition-transform duration-300
                        group-hover:scale-110
                        ${feature.iconClass}
                    `}
                >
                    {feature.icon}
                </div>

                <h3 className="mb-2 text-lg font-bold text-foreground font-[family:var(--font-heading)] leading-snug">
                    {feature.title}
                </h3>

                <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {feature.description}
                </p>
            </div>
        </ScrollReveal>
    );
}

export function BentoGrid() {
    return (
        <section id="features" className="px-8 py-20 max-w-[var(--grid-max-width)] mx-auto w-full">
            <ScrollReveal className="mb-12 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
                    Platform Features
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-[family:var(--font-heading)] text-balance">
                    Everything your org needs,{" "}
                    <span className="text-primary">nothing it doesn&apos;t.</span>
                </h2>
                <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
                    Salina ships with all the modules an organization requires — from identity and governance to communication and events.
                </p>
            </ScrollReveal>

            {/*
                4-col bento on lg — fixes orphaned Adviser card:
                Row 1: [Multi-Tenant: 2] [RBAC: 1] [Branding: 1] = 4 ✓
                Row 2: [Recruitment: 1] [Events: 1] [Adviser: 2]  = 4 ✓
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FEATURES.map((feature, i) => (
                    <BentoCard key={feature.title} feature={feature} delay={i * 0.07} />
                ))}
            </div>
        </section>
    );
}
