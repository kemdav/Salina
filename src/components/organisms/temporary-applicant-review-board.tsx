"use client";

import { useActionState } from "react";

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import {
  confirmTemporaryApplicantAction,
  createTemporaryApplicantAction,
  type TemporaryApplicantActionState,
} from "@/lib/actions/temporary-applicants";

const INITIAL_TEMPORARY_APPLICANT_STATE: TemporaryApplicantActionState = {
  fields: {
    applicantEmail: "",
    applicantName: "",
  },
};

type TemporaryApplicantQueueItem = {
  applicant_email: string;
  applicant_name: string;
  applicant_user_id: string | null;
  application_data: Record<string, unknown> | null;
  id: string;
  status: string;
  submitted_at: string | null;
};

interface TemporaryApplicantReviewBoardProps {
  applicants: TemporaryApplicantQueueItem[];
  loadError?: string;
}

function formatSubmittedAt(submittedAt: string | null) {
  if (!submittedAt) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(submittedAt));
}

function summarizeApplicationData(data: Record<string, unknown> | null) {
  if (!data) {
    return "No application details yet.";
  }

  const entries = Object.entries(data)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .slice(0, 3);

  if (!entries.length) {
    return "No application details yet.";
  }

  return entries
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`)
    .join(" · ");
}

export function TemporaryApplicantReviewBoard({
  applicants,
  loadError,
}: TemporaryApplicantReviewBoardProps) {
  const [createState, createAction, createPending] = useActionState(
    createTemporaryApplicantAction,
    INITIAL_TEMPORARY_APPLICANT_STATE,
  );
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmTemporaryApplicantAction,
    INITIAL_TEMPORARY_APPLICANT_STATE,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-[var(--primary)] text-white">Recruitment</Badge>
            <div>
              <h2
                className="text-3xl font-bold tracking-tight text-slate-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Temporary applicant review
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Review submitted applications, create new temporary applicant invites, and convert approved applicants into official members.
              </p>
            </div>
          </div>
        </div>

        {loadError ? (
          <div className="mt-6">
            <StatusBanner tone="error">{loadError}</StatusBanner>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form action={createAction} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Create temporary applicant</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Generate a sign-up link for a new temporary applicant.
            </p>

            <div className="mt-5 space-y-4">
              <TextField
                defaultValue={createState.fields.applicantName}
                id="applicantName"
                label="Applicant name"
                name="applicantName"
                placeholder="Jordan Reyes"
                required
                type="text"
              />
              <TextField
                defaultValue={createState.fields.applicantEmail}
                id="applicantEmail"
                label="Applicant email"
                name="applicantEmail"
                placeholder="jordan.reyes@campus.edu"
                required
                type="email"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Button disabled={createPending} type="submit" variant="dark">
                {createPending ? "Creating invite..." : "Create invite"}
              </Button>
            </div>

            {createState.error ? (
              <div className="mt-4">
                <StatusBanner tone="error">{createState.error}</StatusBanner>
              </div>
            ) : createState.notice ? (
              <div className="mt-4 space-y-3">
                <StatusBanner tone="success">{createState.notice}</StatusBanner>
                {createState.inviteUrl ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p className="font-semibold">Invite link</p>
                    <a className="mt-1 break-all underline" href={createState.inviteUrl}>
                      {createState.inviteUrl}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
          </form>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Submitted applicants</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  These applicants have finished sign-up and are ready for review.
                </p>
              </div>
              <Badge className="border border-slate-200 bg-white text-slate-700">
                {applicants.length}
              </Badge>
            </div>

            {confirmState.error ? (
              <div className="mt-4">
                <StatusBanner tone="error">{confirmState.error}</StatusBanner>
              </div>
            ) : confirmState.notice ? (
              <div className="mt-4">
                <StatusBanner tone="success">{confirmState.notice}</StatusBanner>
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <article key={applicant.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900">
                          {applicant.applicant_name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600">{applicant.applicant_email}</p>
                      </div>
                      <Badge className="border border-amber-200 bg-amber-50 text-amber-800">
                        {applicant.status}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {summarizeApplicationData(applicant.application_data)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Submitted {formatSubmittedAt(applicant.submitted_at)}
                      </p>

                      <form action={confirmAction}>
                        <input name="temporaryApplicantId" type="hidden" value={applicant.id} />
                        <Button disabled={confirmPending || !applicant.applicant_user_id} type="submit" variant="secondary">
                          {confirmPending ? "Converting..." : "Convert to member"}
                        </Button>
                      </form>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
                  No submitted temporary applicants yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}