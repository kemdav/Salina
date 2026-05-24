"use client";

import { useActionState } from "react";

import { Button } from "@/components/atoms/button";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import {
  submitTemporaryApplicantApplicationAction,
  type TemporaryApplicantApplicationActionState,
} from "@/lib/actions/temporary-applicants";

const INITIAL_APPLICATION_STATE: TemporaryApplicantApplicationActionState = {
  fields: {
    experience: "",
    interests: "",
    motivation: "",
  },
};

function ApplicationTextAreaField({
  defaultValue,
  id,
  label,
  name,
  placeholder,
}: {
  defaultValue: string;
  id: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-medium text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>
      <textarea
        className="min-h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
        defaultValue={defaultValue}
        id={id}
        name={name}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default function MemberApplicationsPage() {
  const [state, formAction, pending] = useActionState(
    submitTemporaryApplicantApplicationAction,
    INITIAL_APPLICATION_STATE,
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">
            Temporary applicant
          </p>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Complete your application
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Tell the organization why you are applying, what experience you
            bring, and what you want to contribute. Your submission will be
            stored for officer review.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm leading-6 text-amber-900">
          Finish this form after sign-up to complete your temporary applicant
          submission.
        </div>

        <form action={formAction} className="mt-6 space-y-5">
          {state.error ? (
            <StatusBanner tone="error">{state.error}</StatusBanner>
          ) : state.notice ? (
            <StatusBanner tone="success">{state.notice}</StatusBanner>
          ) : null}

          <ApplicationTextAreaField
            defaultValue={state.fields.motivation}
            id="motivation"
            label="Why are you applying?"
            name="motivation"
            placeholder="Share what drew you to this organization."
          />

          <ApplicationTextAreaField
            defaultValue={state.fields.experience}
            id="experience"
            label="Relevant experience"
            name="experience"
            placeholder="Describe leadership, volunteer, academic, or community experience that is relevant."
          />

          <TextField
            defaultValue={state.fields.interests}
            id="interests"
            label="What do you want to do here?"
            name="interests"
            placeholder="Events, outreach, design, operations, or anything else."
            required
            type="text"
          />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button disabled={pending} type="submit" variant="dark">
              {pending ? "Saving application..." : "Submit application"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
