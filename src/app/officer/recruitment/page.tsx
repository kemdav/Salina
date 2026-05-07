"use client";

import { useActionState } from "react";

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";
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

const INITIAL_CONFIRM_STATE: TemporaryApplicantActionState = {
    fields: {
        applicantEmail: "",
        applicantName: "",
    },
};

const pipelineColumns = [
    {
        title: "Applied",
        tone: "bg-slate-100 text-slate-900",
        cards: [
            { name: "Nina Flores", note: "Submitted onboarding wizard", tag: "Fresh applicant" },
            { name: "Jordan Lim", note: "Shared essay and leadership goals", tag: "Needs screening" },
        ],
    },
    {
        title: "Screening",
        tone: "bg-amber-100 text-amber-950",
        cards: [
            { name: "Cleo Ramos", note: "Reviewed by intake officers", tag: "For interview" },
            { name: "Rafael Medina", note: "Waiting on recommendation check", tag: "Reference pending" },
        ],
    },
    {
        title: "Interview",
        tone: "bg-blue-100 text-blue-950",
        cards: [
            { name: "Hazel Tan", note: "Panel scheduled for Thursday", tag: "Panel booked" },
            { name: "Avery Cruz", note: "Completed first-round discussion", tag: "Score pending" },
        ],
    },
    {
        title: "Accepted",
        tone: "bg-emerald-100 text-emerald-950",
        cards: [
            { name: "Mika Torres", note: "Ready for onboarding and roster sync", tag: "Offer sent" },
        ],
    },
];

const recruitmentStats = [
    { label: "Applicants", value: "18" },
    { label: "Interviews", value: "6" },
    { label: "Accepted", value: "4" },
];

export default function OfficerRecruitmentPage() {
    const [createState, createAction, createPending] = useActionState(
        createTemporaryApplicantAction,
        INITIAL_TEMPORARY_APPLICANT_STATE,
    );
    const [confirmState, confirmAction, confirmPending] = useActionState(
        confirmTemporaryApplicantAction,
        INITIAL_CONFIRM_STATE,
    );

    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Recruitment</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                                    Officer recruitment pipeline
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Review applicants, move them through the pipeline, and keep interview progress visible at a glance.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary">Pipeline settings</Button>
                            <Button variant="dark">Add applicant</Button>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-amber-600 text-white">Temporary UI</Badge>
                            <p className="text-sm font-medium text-amber-900">
                                Temporary applicant tools. This is a provisional workflow until the final recruitment design is built.
                            </p>
                        </div>

                        <div className="mt-5 grid gap-6 lg:grid-cols-2">
                            <form action={createAction} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-slate-900">Create temporary applicant</h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Generate an invite link for a temporary applicant who will finish the application flow before conversion.
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

                            <form action={confirmAction} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-slate-900">Confirm temporary applicant</h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Once the applicant finishes the workflow, convert their temporary account into an official member.
                                </p>

                                <div className="mt-5 space-y-4">
                                    <TextField
                                        defaultValue=""
                                        id="temporaryApplicantId"
                                        label="Temporary applicant ID"
                                        name="temporaryApplicantId"
                                        placeholder="Paste the temporary applicant UUID"
                                        required
                                        type="text"
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-3">
                                    <Button disabled={confirmPending} type="submit" variant="secondary">
                                        {confirmPending ? "Confirming..." : "Confirm applicant"}
                                    </Button>
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
                            </form>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {recruitmentStats.map((stat) => (
                            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-4">
                    {pipelineColumns.map((column) => (
                        <article key={column.title} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${column.tone}`}>{column.title}</div>

                            <div className="mt-4 space-y-3">
                                {column.cards.map((card) => (
                                    <div key={card.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <Badge className="border border-[#c6623e]/20 bg-[#c6623e]/12 text-[#7c2d12]">{card.tag}</Badge>
                                        <h3 className="mt-3 text-lg font-semibold text-slate-900">{card.name}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-700">{card.note}</p>
                                        <div className="mt-4 flex gap-3">
                                            <Button variant="secondary">Review</Button>
                                            <Button variant="secondary">Move</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Pipeline notes</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <p>• Use the screening stage to confirm completed onboarding responses.</p>
                            <p>• Keep interview scores visible before promoting applicants to accepted.</p>
                            <p>• Sync accepted applicants with the roster page after onboarding.</p>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Review cadence</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                            <div className="rounded-2xl bg-slate-50 p-4">Screening every Monday and Thursday</div>
                            <div className="rounded-2xl bg-slate-50 p-4">Interviews scheduled inside the event calendar</div>
                        </div>
                    </article>
                </section>
            </div>
        </AuthenticatedShell>
    );
}