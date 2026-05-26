"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FieldMessage } from "@/components/atoms/field-message";
import { OnboardingHeader } from "@/components/organisms/onboarding-header";
import { StepIndicator } from "@/components/molecules/step-indicator";
import { WizardFooter } from "@/components/molecules/wizard-footer";
import {
  OrgSpaceSetupForm,
  type OrganizationSetupErrors,
  type OrganizationSetupState,
} from "@/components/organisms/org-setup-form";
import {
  BrandingSetupForm,
  type BrandingThemeConfig,
} from "@/components/organisms/branding-setup-form";
import { submitAccreditationRequest } from "@/lib/actions/accreditation-requests";

const INITIAL_ORGANIZATION_SETUP: OrganizationSetupState = {
  name: "",
  slug: "",
  billingEmail: "",
  organizationType: "",
  parentAffiliation: "",
};

const INITIAL_BRANDING_THEME_CONFIG: BrandingThemeConfig = {
  fontFamily: "var(--font-heading), sans-serif",
  primaryColor: "#c6623e",
  logoUrl: "",
};

function validateOrganizationSetup(
  value: OrganizationSetupState,
): OrganizationSetupErrors {
  const errors: OrganizationSetupErrors = {};

  if (!value.name.trim()) {
    errors.name = "Organization name is required.";
  }

  if (!value.slug.trim()) {
    errors.slug = "Organization slug is required.";
  }

  if (!value.billingEmail.trim()) {
    errors.billingEmail = "Billing email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.billingEmail)) {
    errors.billingEmail = "Please enter a valid billing email address.";
  }

  if (!value.organizationType.trim()) {
    errors.organizationType = "Please select an organization type.";
  }

  return errors;
}

export function OnboardingTemplate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [organizationSetup, setOrganizationSetup] =
    useState<OrganizationSetupState>(INITIAL_ORGANIZATION_SETUP);
  const [brandingThemeConfig, setBrandingThemeConfig] =
    useState<BrandingThemeConfig>(INITIAL_BRANDING_THEME_CONFIG);
  const [organizationErrors, setOrganizationErrors] =
    useState<OrganizationSetupErrors>({});
  const [launchError, setLaunchError] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const isFinalStep = currentStep === 3;

  const updateOrganizationField = <K extends keyof OrganizationSetupState>(
    field: K,
    nextValue: OrganizationSetupState[K],
  ) => {
    setOrganizationSetup((current) => ({
      ...current,
      [field]: nextValue,
    }));

    setOrganizationErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const launchWorkspace = async () => {
    const validationErrors = validateOrganizationSetup(organizationSetup);

    if (Object.keys(validationErrors).length > 0) {
      setOrganizationErrors(validationErrors);
      setCurrentStep(1);
      setLaunchError("Complete the organization details before launching.");
      return;
    }

    setIsLaunching(true);
    setLaunchError("");

    try {
      const result = await submitAccreditationRequest({
        billingEmail: organizationSetup.billingEmail,
        name: organizationSetup.name,
        organizationType: organizationSetup.organizationType,
        slug: organizationSetup.slug,
      });

      if (!result.ok) {
        setLaunchError(result.error);
        return;
      }

      router.refresh(); // Refresh to trigger Server Component redirect
    } catch {
      setLaunchError("Something went wrong. Please try again.");
    } finally {
      setIsLaunching(false);
    }
  };

  const handleNext = () => {
    if (isFinalStep) {
      void launchWorkspace();
      return;
    }

    if (currentStep === 1) {
      const validationErrors = validateOrganizationSetup(organizationSetup);

      if (Object.keys(validationErrors).length > 0) {
        setOrganizationErrors(validationErrors);
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

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
        return (
          <OrgSpaceSetupForm
            errors={organizationErrors}
            onChange={updateOrganizationField}
            value={organizationSetup}
          />
        );
      case 2:
        return (
          <BrandingSetupForm onThemeConfigChange={setBrandingThemeConfig} />
        );
      case 3:
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
            <h3
              className="text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to Launch
            </h3>
            <p className="text-(--muted)">
              Review your setup and launch the workspace when you are ready.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
              <div
                className="size-4 rounded-full border border-black/10"
                style={{ backgroundColor: brandingThemeConfig.primaryColor }}
              />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  Branding ready
                </p>
                <p
                  className="text-xs text-(--muted)"
                  style={{ fontFamily: brandingThemeConfig.fontFamily }}
                >
                  {brandingThemeConfig.fontFamily}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <OrgSpaceSetupForm
            errors={organizationErrors}
            onChange={updateOrganizationField}
            value={organizationSetup}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <OnboardingHeader />

      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mx-auto w-full max-w-5xl">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "w-full bg-background rounded-2xl shadow-sm border border-border p-8 pt-6 md:p-10 md:pt-8 flex flex-col min-h-125 transition-all duration-500",
            currentStep === 2 ? "max-w-5xl" : "max-w-2xl",
          )}
        >
          <div className="flex-1" key={currentStep}>
            {renderStepContent()}
          </div>

          {launchError ? (
            <div className="mt-6">
              <FieldMessage role="alert" variant="error">
                {launchError}
              </FieldMessage>
            </div>
          ) : null}

          <WizardFooter
            onNext={handleNext}
            onBack={handleBack}
            disableBack={isLaunching}
            disableNext={isLaunching}
            nextLabel={
              isLaunching
                ? "Launching..."
                : isFinalStep
                  ? "Launch Workspace"
                  : "Continue"
            }
          />
        </div>
      </div>
    </div>
  );
}
