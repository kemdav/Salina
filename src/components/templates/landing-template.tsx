"use client";

import { TopNavigation } from "@/components/organisms/top-navigation";
import { HeroSection } from "@/components/organisms/hero-section";
import { SocialProofBanner } from "@/components/organisms/social-proof-banner";
import { BentoGrid } from "@/components/organisms/bento-grid";
import { HowItWorks } from "@/components/organisms/how-it-works";
import { PricingSection } from "@/components/organisms/pricing-section";
import { HighlightSection } from "@/components/organisms/highlight-section";
import { SiteFooter } from "@/components/organisms/footer";

export function LandingTemplate() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-[family:var(--font-body)] text-foreground">
      <TopNavigation />
      <HeroSection />
      <SocialProofBanner />
      <BentoGrid />
      <HowItWorks />
      <PricingSection />
      <HighlightSection />
      <SiteFooter />
    </div>
  );
}
