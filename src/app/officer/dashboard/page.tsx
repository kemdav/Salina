import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { StatusBanner } from "@/components/molecules/status-banner";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

const overviewCards = [
    { title: "Active Members", value: "142", trend: "+12 this semester", tone: "emerald" },
    { title: "Pending Applications", value: "8", trend: "Awaiting review", tone: "amber" },
    { title: "Upcoming Events", value: "2", trend: "Next: CPE Challenge", tone: "blue" },
    { title: "Task Delegations", value: "5", trend: "Requires attention", tone: "violet" },
];

const announcements = [
    {
        title: "Officer meeting confirmed for Friday",
        category: "Operations",
        time: "12 minutes ago",
        body: "Attendance, event logistics, and committee updates will be reviewed in the west wing conference room.",
    },
    {
        title: "Recruitment shortlist ready for review",
        category: "Recruitment",
        time: "1 hour ago",
        body: "The screening team moved three candidates into interview prep after verifying the onboarding responses.",
    },
    {
        title: "QR attendance flow updated",
        category: "Attendance",
        time: "Today at 8:15 AM",
        body: "Officers can now open the check-in sheet directly from the attendance page during live events.",
    },
];

const operations = [
    {
        title: "Attendance tonight",
        value: "Opens 4:30 PM",
        detail: "Manual and QR check-in are both enabled for the chapter mixer.",
    },
    {
        title: "Pipeline health",
        value: "3 interviews pending",
        detail: "The recruitment board is waiting for officer scoring on the newest applicants.",
    },
    {
        title: "Feed engagement",
        value: "18 reads today",
        detail: "The last announcement was read by almost every active officer within the first hour.",
    },
];

export default function OfficerDashboardPage() {
    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Officer command center</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Welcome back, Excel
                                </h2>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                                    Cebu Institute of Technology - University officers can track membership, attendance, recruitment, and updates from one place.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="dark">Post announcement</Button>
                            <Button variant="secondary">Open feed</Button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <StatusBanner tone="info" className="border-slate-200 bg-slate-50 text-slate-600">
                            Attendance check-in opens at 4:30 PM today. The recruitment queue has 8 applicants waiting for review.
                        </StatusBanner>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {overviewCards.map((card) => (
                        <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${card.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' : card.tone === 'amber' ? 'bg-amber-50 text-amber-700' : card.tone === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}
                                >
                                    Live
                                </span>
                            </div>
                            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
                            <p className="mt-2 text-sm text-slate-500">{card.trend}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <Badge className="bg-slate-900 text-white">Live feed preview</Badge>
                                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Recent announcements
                                </h3>
                            </div>

                            <Button variant="secondary">View full feed</Button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <Badge className="bg-white text-slate-700 border border-slate-200">{announcement.category}</Badge>
                                            <h4 className="mt-3 text-lg font-semibold text-slate-900">{announcement.title}</h4>
                                        </div>
                                        <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{announcement.time}</span>
                                    </div>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{announcement.body}</p>
                                </div>
                            ))}
                        </div>
                    </article>

                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Today&apos;s operations</h3>
                            <div className="mt-5 space-y-4">
                                {operations.map((item) => (
                                    <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                                        <p className="text-sm font-medium text-slate-500">{item.title}</p>
                                        <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
                            <div className="mt-5 space-y-3">
                                <Button variant="secondary" className="w-full justify-between">
                                    <span>Create event</span>
                                    <span aria-hidden="true">→</span>
                                </Button>
                                <Button variant="secondary" className="w-full justify-between">
                                    <span>Export attendance log</span>
                                    <span aria-hidden="true">→</span>
                                </Button>
                                <Button variant="secondary" className="w-full justify-between">
                                    <span>Manage roles</span>
                                    <span aria-hidden="true">→</span>
                                </Button>
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </AuthenticatedShell>
    );
}