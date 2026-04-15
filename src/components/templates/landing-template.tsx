"use client";

import { TopNavigation } from "@/components/organisms/top-navigation";
import { HeroSection } from "@/components/organisms/hero-section";
import { SiteFooter } from "@/components/organisms/footer";

export function LandingTemplate() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-[family:var(--font-body)] text-foreground">
      <TopNavigation />
      <HeroSection />
      <SiteFooter />
    </div>
  );
}
