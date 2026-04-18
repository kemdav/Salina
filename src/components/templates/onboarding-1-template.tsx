"use client";

import { SalinaLogo } from "@/components/atoms/salina-logo"; // Adjust path if you moved your logo!
import { StepIndicator } from "@/components/molecules/step-indicator";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import { OrgSpaceSetupForm } from "@/components/organisms/org-setup-form";

export function OnboardingTemplate() {
  // We are hardcoding this to 1 for now. We will add state later when we build Step 2!
  const currentStep = 1;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-[family:var(--font-body)]">
      {/* Top Logo */}
      <div className="mb-8">
        <SalinaLogo variant="dark" width={120} />
      </div>

      {/* Main Wizard Card */}
      <div className="w-full max-w-2xl bg-background rounded-2xl shadow-sm border border-border p-8 md:p-10 flex flex-col min-h-[500px]">
        {/* Progress Tracker */}
        <StepIndicator currentStep={currentStep} />

        {/* Dynamic Form Content Area */}
        <div className="flex-1 mt-4">
          <OrgSpaceSetupForm />
        </div>

        {/* Persistent Footer */}
        <WizardFooter
          onNext={() => console.log("Next clicked")}
          onBack={() => console.log("Back clicked")}
          disableBack={currentStep === 1} // Disabled on step 1 since they can't go back!
        />
      </div>
    </div>
  );
}
