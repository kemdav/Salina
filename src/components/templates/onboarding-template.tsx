"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { OnboardingHeader } from "@/components/organisms/onboarding-header";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import { OrgSpaceSetupForm } from "@/components/organisms/org-setup-form";
import { BrandingSetupForm } from "@/components/organisms/branding-setup-form";

export function OnboardingTemplate() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrgSpaceSetupForm />;
      case 2:
        // Swapped in your new Branding Setup Form!
        return <BrandingSetupForm />;
      case 3:
        return (
          <div className="p-8 text-center text-muted-foreground animate-in fade-in">
            Pipeline Setup Form (Coming Soon)
          </div>
        );
      case 4:
        return (
          <div className="p-8 text-center text-muted-foreground animate-in fade-in">
            Launch Screen (Coming Soon)
          </div>
        );
      default:
        // Fixed the typo here from OrgSpaceSetupFormz
        return <OrgSpaceSetupForm />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family:var(--font-body)]">
      {/* Persistent Header */}
      <OnboardingHeader currentStep={currentStep} />

      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        {/* THIS IS WHERE THE SNIPPET GOES! It replaces the old static max-w-2xl div */}
        <div
          className={cn(
            "w-full bg-background rounded-2xl shadow-sm border border-border p-8 pt-6 md:p-10 md:pt-8 flex flex-col min-h-[500px] transition-all duration-500",
            currentStep === 2 ? "max-w-5xl" : "max-w-2xl",
          )}
        >
          {/* Main Form Area */}
          <div className="flex-1">{renderStepContent()}</div>

          {/* Footer Area */}
          <WizardFooter
            onNext={handleNext}
            onBack={handleBack}
            disableBack={currentStep === 1}
            // Change the button text on the final step
            nextLabel={currentStep === 4 ? "Launch Workspace" : "Continue"}
          />
        </div>
      </div>
    </div>
  );
}
