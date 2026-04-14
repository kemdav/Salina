"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/atoms/button";
import { AuthHeading } from "@/components/molecules/auth-heading";
import { AuthLinkRow } from "@/components/molecules/auth-link-row";
import { PasswordField } from "@/components/molecules/password-field";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import { getCanonicalLocalAuthUrl } from "@/lib/host-routing";
import { signInAction, type LoginActionState } from "@/lib/actions/auth";

const INITIAL_LOGIN_ACTION_STATE: LoginActionState = {
  email: "",
  error: "",
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    signInAction,
    INITIAL_LOGIN_ACTION_STATE
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
        description="Welcome back. Enter your details to continue."
        title="Sign in"
      />

      {state.error ? <StatusBanner tone="error">{state.error}</StatusBanner> : null}

      <form action={formAction} className="flex flex-col gap-5" noValidate>
        <TextField
          aria-label="Email address"
          autoComplete="email"
          defaultValue={state.email}
          id="email"
          label="Email Address"
          name="email"
          placeholder="you@organization.com"
          required
          type="email"
        />

        <PasswordField
          aria-label="Password"
          autoComplete="current-password"
          id="password"
          label="Password"
          linkHref="/reset-password"
          linkLabel="Forgot password?"
          name="password"
          placeholder="••••••••"
          required
        />

        <Button
          className="mt-2 h-12 w-full text-[15px] font-semibold tracking-[0.01em] [font-family:var(--font-heading)]"
          disabled={pending}
          type="submit"
          variant="primary"
        >
          {pending ? "Signing in..." : "Sign in →"}
        </Button>
      </form>

      <AuthLinkRow
        className="pt-1"
        href="/sign-up"
        linkLabel="Sign up"
        prefix="Don't have an account?"
      />
    </div>
  );
}
