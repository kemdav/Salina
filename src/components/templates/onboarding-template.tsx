"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingHeader } from "@/components/organisms/onboarding-header";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import { OrgSpaceSetupForm } from "@/components/organisms/org-setup-form";
import { BrandingSetupForm } from "@/components/organisms/branding-setup-form";
import { PipelineSetupForm } from "@/components/organisms/pipeline-setup-form";

export function OnboardingTemplate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));

  const handleBack = () => {
    if (currentStep === 1) {
      router.push("/sign-up");
    } else {
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
        // PIpeline goes in Case 3!
        return <PipelineSetupForm />;
      case 4:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold font-[family:var(--font-heading)] text-foreground mb-2">
              Ready to Launch
            </h3>
            <p className="text-[var(--muted)]">
              idk how to go about the payment actually hehe. (Coming Soon)
            </p>
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
            currentStep === 2 || currentStep === 3 ? "max-w-5xl" : "max-w-2xl",
          )}
        >
          <div className="flex-1" key={currentStep}>
            {renderStepContent()}
          </div>

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
