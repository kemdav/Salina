"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingHeader } from "@/components/organisms/onboarding-header";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import { OrgSpaceSetupForm } from "@/components/organisms/org-setup-form";
import { BrandingSetupForm } from "@/components/organisms/branding-setup-form";

export function OnboardingTemplate() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const handleBack = () => {
    if (currentStep === 1) {
      // If we are on step 1, route back to the sign-up page
      router.push("/sign-up");
    } else {
      // Otherwise, just go back one step in the wizard
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrgSpaceSetupForm />;
      case 2:
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
        return <OrgSpaceSetupForm />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family:var(--font-body)]">
      <OnboardingHeader currentStep={currentStep} />

      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "w-full bg-background rounded-2xl shadow-sm border border-border p-8 pt-6 md:p-10 md:pt-8 flex flex-col min-h-[500px] transition-all duration-500",
            currentStep === 2 ? "max-w-5xl" : "max-w-2xl",
          )}
        >
          <div className="flex-1">{renderStepContent()}</div>

          <WizardFooter
            onNext={handleNext}
            onBack={handleBack}
            nextLabel={currentStep === 4 ? "Launch Workspace" : "Continue"}
          />
        </div>
      </div>
    </div>
  );
}
