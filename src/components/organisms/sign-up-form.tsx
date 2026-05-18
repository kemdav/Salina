"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/atoms/button";
import { AuthHeading } from "@/components/molecules/auth-heading";
import { AuthLinkRow } from "@/components/molecules/auth-link-row";
import { FormDivider } from "@/components/molecules/form-divider";
import { PasswordField } from "@/components/molecules/password-field";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import { AUTH_PASSWORD_HELP_TEXT } from "@/lib/auth-policy";
import { getCanonicalLocalAuthUrl } from "@/lib/host-routing";
import { signUpAction, type SignUpActionState } from "@/lib/actions/auth";

type InviteData = {
  applicantEmail: string;
  applicantName: string;
} | null;

export type SignUpFormProps = {
  inviteData?: InviteData;
  inviteToken?: string;
};

const INITIAL_SIGN_UP_ACTION_STATE: SignUpActionState = {
  errors: {},
  fields: {
    email: "",
    fullName: "",
  },
  formError: undefined,
  formNotice: undefined,
};

export function SignUpForm(props: SignUpFormProps) {
  const { inviteData, inviteToken } = props;
  const searchParams = useSearchParams();
  const token = inviteToken ?? searchParams.get("invite") ?? "";
  const [state, formAction, pending] = useActionState(
    signUpAction,
    INITIAL_SIGN_UP_ACTION_STATE
  );

  useEffect(() => {
    const redirectUrl = getCanonicalLocalAuthUrl(window.location);

    if (redirectUrl) {
      window.location.replace(redirectUrl);
    }
  }, []);

  return (
    <div className="space-y-7 [font-family:var(--font-body)]">
      <AuthHeading
        description="Your organization. Your way."
        title="Create account"
      />

      <Button
        className="h-11.5 w-full gap-2.5 text-sm font-medium"
        type="button"
        variant="secondary"
      >
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-[3px] bg-[#4285F4] text-[10px] font-bold text-white">
          G
        </span>
        Continue with Google
      </Button>

      <FormDivider label="Or email" />

      {state.formError ? (
        <StatusBanner tone="error">{state.formError}</StatusBanner>
      ) : state.formNotice ? (
        <StatusBanner tone="success">{state.formNotice}</StatusBanner>
      ) : null}

      {token ? (
        <StatusBanner tone="info">
          {inviteData
            ? "Your name and email were filled from this invitation and cannot be changed."
            : "Temporary UI: this invite will create a temporary applicant account for the linked organization."}
        </StatusBanner>
      ) : null}

      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <input name="inviteToken" type="hidden" value={token} />
        <TextField
          aria-label="Full name"
          defaultValue={inviteData?.applicantName ?? state.fields.fullName}
          error={state.errors.fullName}
          id="fullName"
          label="Full Name"
          name="fullName"
          placeholder="Alexander Salina"
          readOnly={Boolean(inviteData)}
          required
          type="text"
        />

        <TextField
          aria-label="Email address"
          autoComplete="email"
          defaultValue={inviteData?.applicantEmail ?? state.fields.email}
          error={state.errors.email}
          id="email"
          label="Email Address"
          name="email"
          placeholder="you@organization.com"
          readOnly={Boolean(inviteData)}
          required
          type="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            aria-label="Password"
            autoComplete="new-password"
            error={state.errors.password}
            helperText={AUTH_PASSWORD_HELP_TEXT}
            id="password"
            label="Password"
            name="password"
            placeholder="••••••••"
            required
          />
          <PasswordField
            aria-label="Confirm password"
            autoComplete="new-password"
            error={state.errors.confirmPassword}
            id="confirmPassword"
            label="Confirm"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />
        </div>

        <Button
          className="mt-2 h-12 w-full text-[15px] font-semibold tracking-[0.02em] [font-family:var(--font-heading)]"
          disabled={pending}
          type="submit"
          variant="dark"
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <AuthLinkRow
        href="/login"
        linkLabel="Sign in"
        prefix="Already have an account?"
      />
    </div>
  );
}
