"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { PasswordField } from "@/components/molecules/password-field";
import { redeemAdviserInviteAction, type RedeemAdviserActionState } from "@/lib/actions/advisers";
import { AuthHeading } from "@/components/molecules/auth-heading";
import { AUTH_PASSWORD_MIN_LENGTH } from "@/lib/auth-policy";

const initialState: RedeemAdviserActionState = {};

export function AdviserSignUpForm({ inviteToken }: { inviteToken: string }) {
  const [state, formAction, isPending] = useActionState(
    redeemAdviserInviteAction,
    initialState
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <AuthHeading
        title="Complete your registration"
        description="Set your password and confirm your organization to become an adviser."
      />

      <form action={formAction} className="mt-8 space-y-6">
        <input type="hidden" name="inviteToken" value={inviteToken} />

        {state.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div>
          <label
            htmlFor="organizationName"
            className="block text-sm font-medium leading-6 text-slate-900"
          >
            Organization Name
          </label>
          <div className="mt-2">
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              required
              autoComplete="organization"
              placeholder="e.g. Acme Corp"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <div className="mt-2">
            <PasswordField
              id="password"
              name="password"
              label="Create Password"
              required
              autoComplete="new-password"
              disabled={isPending}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Must be at least {AUTH_PASSWORD_MIN_LENGTH} characters.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
