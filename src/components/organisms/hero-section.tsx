'use client';

import { HeroActions } from '@/components/molecules/hero-actions';

export function HeroSection() {
    return (
        <main className="flex-1 flex items-center">
            <section className="px-8 py-12 max-w-[var(--grid-max-width)] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Side: Copy and Actions */}
                <div className="flex flex-col gap-6 max-w-xl">
                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] text-balance font-[family:var(--font-heading)]">
                        The Operating System for Organizations.
                    </h1>

                    <p className="text-lg text-[var(--muted)] leading-relaxed text-pretty">
                        From recruitment pipelines to governance modules — everything your organization needs to thrive, in one unified platform.
                    </p>

                    {/* Action Buttons Molecule */}
                    <HeroActions />
                </div>

                {/* Right Side: The Big Image Placeholder Block */}
                <div className="w-full aspect-[4/3] lg:aspect-square bg-slate-50 border-2 border-dashed border-border rounded-[var(--radius)] flex flex-col items-center justify-center text-[var(--muted)] shadow-sm">
                    <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium tracking-wide">Image Placeholder</span>
                    <span className="text-xs opacity-75 mt-1">Platform Graphic</span>
                </div>

            </section>
        </main>
    );
}