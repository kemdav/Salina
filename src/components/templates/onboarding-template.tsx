"use client";

import { useState } from "react";
import { OnboardingHeader } from "@/components/organisms/onboarding-header";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import { OrgSpaceSetupForm } from "@/components/organisms/org-setup-form";

export function OnboardingTemplate() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrgSpaceSetupForm />;
      case 2:
        return (
          <div className="p-8 text-center text-muted-foreground animate-in fade-in">
            Branding Configuration Form (Coming Soon)
          </div>
        );
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
        return <OrgSpaceSetupFormz />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family:var(--font-body)]">
      {/* Pass the state variable here! It will automatically update the text */}
      <OnboardingHeader currentStep={currentStep} />

      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-background rounded-2xl shadow-sm border border-border p-8 pt-6 md:p-10 md:pt-8 flex flex-col min-h-[500px]">
          <div className="flex-1">{renderStepContent()}</div>

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
