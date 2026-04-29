import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

const pipelineColumns = [
    {
        title: "Applied",
        tone: "bg-slate-50 text-slate-700",
        cards: [
            { name: "Nina Flores", note: "Submitted onboarding wizard", tag: "Fresh applicant" },
            { name: "Jordan Lim", note: "Shared essay and leadership goals", tag: "Needs screening" },
        ],
    },
    {
        title: "Screening",
        tone: "bg-amber-50 text-amber-700",
        cards: [
            { name: "Cleo Ramos", note: "Reviewed by intake officers", tag: "For interview" },
            { name: "Rafael Medina", note: "Waiting on recommendation check", tag: "Reference pending" },
        ],
    },
    {
        title: "Interview",
        tone: "bg-blue-50 text-blue-700",
        cards: [
            { name: "Hazel Tan", note: "Panel scheduled for Thursday", tag: "Panel booked" },
            { name: "Avery Cruz", note: "Completed first-round discussion", tag: "Score pending" },
        ],
    },
    {
        title: "Accepted",
        tone: "bg-emerald-50 text-emerald-700",
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
    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Recruitment</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Officer recruitment pipeline
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Review applicants, move them through the pipeline, and keep interview progress visible at a glance.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary">Pipeline settings</Button>
                            <Button variant="dark">Add applicant</Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {recruitmentStats.map((stat) => (
                            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
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
                                        <Badge className="bg-white text-slate-700 border border-slate-200">{card.tag}</Badge>
                                        <h3 className="mt-3 text-lg font-semibold text-slate-900">{card.name}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{card.note}</p>
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
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                            <p>• Use the screening stage to confirm completed onboarding responses.</p>
                            <p>• Keep interview scores visible before promoting applicants to accepted.</p>
                            <p>• Sync accepted applicants with the roster page after onboarding.</p>
                        </div>
                    </article>

                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">Review cadence</h3>
                        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                            <div className="rounded-2xl bg-slate-50 p-4">Screening every Monday and Thursday</div>
                            <div className="rounded-2xl bg-slate-50 p-4">Interviews scheduled inside the event calendar</div>
                        </div>
                    </article>
                </section>
            </div>
        </AuthenticatedShell>
    );
}