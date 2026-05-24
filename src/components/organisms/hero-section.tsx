"use client";

import { HeroActions } from "@/components/molecules/hero-actions";

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
            From recruitment pipelines to governance modules — everything your
            organization needs to thrive, in one unified platform.
          </p>

          {/* Action Buttons Molecule */}
          <HeroActions />
        </div>

        {/* Right Side: Platform Screenshot */}
        <div className="w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80"
            alt="Teams collaborating using Salina"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
