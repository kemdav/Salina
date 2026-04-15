"use client";

import { TopNavigation } from "@/components/organisms/top-navigation";
import { HeroSection } from "@/components/organisms/hero-section";

// The "export" keyword here is what makes this file a "module"
export function LandingTemplate() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-[family:var(--font-body)] text-foreground">
      <TopNavigation />
      <HeroSection />
    </div>
  );
}
