"use client";

import { useActionState, useEffect } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import {
  selfInitiateApplicationAction,
  type TemporaryApplicantActionState,
} from "@/lib/actions/temporary-applicants";

const INITIAL_STATE: TemporaryApplicantActionState = {
  fields: {
    applicantEmail: "",
    applicantName: "",
  },
};

export function SelfInitiateApplicationForm({
  tenantSlug,
  entryId,
  entryTitle,
  entryDescription,
}: {
  tenantSlug: string;
  entryId: string;
  entryTitle: string;
  entryDescription?: string | null;
}) {
  const [state, action, pending] = useActionState(
    selfInitiateApplicationAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.inviteUrl && typeof window !== "undefined") {
      window.location.href = state.inviteUrl;
    }
  }, [state.inviteUrl]);

  return (
    <div className="mx-auto max-w-xl py-12 px-6">
      <div className="mb-8 text-center">
        <Badge className="bg-[#c6623e] text-white mb-4">Application</Badge>
        <h1
          className="text-3xl font-bold tracking-tight text-slate-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {entryTitle}
        </h1>
        {entryDescription && (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {entryDescription}
          </p>
        )}
      </div>

      <form action={action} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Start your application</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Enter your details below to begin.
        </p>

        <div className="mt-6 space-y-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="recruitmentEntryId" value={entryId} />

          <TextField
            defaultValue={state.fields.applicantName}
            id="applicantName"
            label="Full name"
            name="applicantName"
            placeholder="Jordan Reyes"
            required
            type="text"
          />
          <TextField
            defaultValue={state.fields.applicantEmail}
            id="applicantEmail"
            label="Email address"
            name="applicantEmail"
            placeholder="jordan.reyes@campus.edu"
            required
            type="email"
          />
        </div>

        <div className="mt-6">
          <Button disabled={pending || !!state.inviteUrl} type="submit" variant="dark" className="w-full">
            {pending ? "Submitting..." : !!state.inviteUrl ? "Redirecting..." : "Continue to Application"}
          </Button>
        </div>

        {state.error ? (
          <div className="mt-4">
            <StatusBanner tone="error">{state.error}</StatusBanner>
          </div>
        ) : state.notice && !state.inviteUrl ? (
          <div className="mt-4">
            <StatusBanner tone="error">{state.notice}</StatusBanner>
          </div>
        ) : null}
      </form>
    </div>
  );
}
