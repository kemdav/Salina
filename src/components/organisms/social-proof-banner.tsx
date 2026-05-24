"use client";

import { motion } from "framer-motion";

interface LogoDef {
    name: string;
    color: string;
    bg: string;
    mark: React.ReactNode;
}

const LOGOS: LogoDef[] = [
    {
        name: "Apex Consulting",
        color: "#2563EB",
        bg: "#EFF6FF",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <polygon points="12,2 22,20 2,20" />
            </svg>
        ),
    },
    {
        name: "Nova Dynamics",
        color: "#7C3AED",
        bg: "#F5F3FF",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6Z" />
            </svg>
        ),
    },
    {
        name: "Stellar Tech",
        color: "#0D9488",
        bg: "#F0FDFA",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2l2.09 6.26L20 12l-5.91 3.74L12 22l-2.09-6.26L4 12l5.91-3.74Z" />
            </svg>
        ),
    },
    {
        name: "Lumina Global",
        color: "#EA580C",
        bg: "#FFF7ED",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        name: "Nexus Core",
        color: "#4338CA",
        bg: "#EEF2FF",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <circle cx="12" cy="5" r="2.5" />
                <circle cx="5" cy="17" r="2.5" />
                <circle cx="19" cy="17" r="2.5" />
                <path d="M12 7.5L5.5 15M12 7.5L18.5 15M5.5 17h13" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
        ),
    },
    {
        name: "Vanguard Systems",
        color: "#059669",
        bg: "#ECFDF5",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6L12 2z" />
            </svg>
        ),
    },
    {
        name: "Aether Labs",
        color: "#DB2777",
        bg: "#FDF2F8",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
            </svg>
        ),
    },
    {
        name: "Optic Prime",
        color: "#0891B2",
        bg: "#ECFEFF",
        mark: (
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "Quantum Mechanics",
        color: "#E11D48",
        bg: "#FFF1F2",
        mark: (
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "Peak Advisory",
        color: "#D97706",
        bg: "#FFFBEB",
        mark: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M2 20L9 7l4 6 3-4 6 11H2z" />
            </svg>
        ),
    },
];

const TRACK = [...LOGOS, ...LOGOS];

export function SocialProofBanner() {
    return (
        <section className="border-y border-border bg-slate-50/60 py-10 overflow-hidden">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] mb-6">
                Trusted by organizations like yours
            </p>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent" />

                <motion.div
                    className="flex gap-3 w-max"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 32, ease: "linear", repeat: Infinity }}
                >
                    {TRACK.map((logo, i) => (
                        <div
                            key={i}
                            className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-2.5 shadow-sm"
                        >
                            <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                                style={{ backgroundColor: logo.bg, color: logo.color }}
                            >
                                {logo.mark}
                            </span>
                            <span className="text-sm font-semibold whitespace-nowrap" style={{ color: logo.color }}>
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
