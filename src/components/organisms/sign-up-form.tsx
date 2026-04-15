"use client";

import { useActionState } from "react";

import { Button } from "@/components/atoms/button";
import { AuthHeading } from "@/components/molecules/auth-heading";
import { AuthLinkRow } from "@/components/molecules/auth-link-row";
import { FormDivider } from "@/components/molecules/form-divider";
import { PasswordField } from "@/components/molecules/password-field";
import { TextField } from "@/components/molecules/text-field";
import { signUpAction, type SignUpActionState } from "@/lib/actions/auth";

const INITIAL_SIGN_UP_ACTION_STATE: SignUpActionState = {
  errors: {},
  fields: {
    email: "",
    fullName: "",
  },
};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    INITIAL_SIGN_UP_ACTION_STATE
  );

  return (
    <div className="space-y-7 [font-family:var(--font-body)]">
      <AuthHeading
        description="Your organization. Your way."
        title="Create account"
      />

      <Button
        className="h-[46px] w-full gap-2.5 text-sm font-medium"
        type="button"
        variant="secondary"
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[3px] bg-[#4285F4] text-[10px] font-bold text-white">
          G
        </span>
        Continue with Google
      </Button>

      <FormDivider label="Or email" />

      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <TextField
          aria-label="Full name"
          defaultValue={state.fields.fullName}
          error={state.errors.fullName}
          id="fullName"
          label="Full Name"
          name="fullName"
          placeholder="Alexander Salina"
          required
          type="text"
        />

        <TextField
          aria-label="Email address"
          autoComplete="email"
          defaultValue={state.fields.email}
          error={state.errors.email}
          id="email"
          label="Email Address"
          name="email"
          placeholder="you@organization.com"
          required
          type="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            aria-label="Password"
            autoComplete="new-password"
            error={state.errors.password}
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
