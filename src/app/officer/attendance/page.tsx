import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { StatusBanner } from "@/components/molecules/status-banner";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

const queue = [
    { name: "Camille Reyes", role: "Secretary", status: "Queued" },
    { name: "Andrei Cruz", role: "Treasurer", status: "Queued" },
    { name: "Mika Delgado", role: "Public Relations", status: "Queued" },
    { name: "Jules Navarro", role: "Member", status: "Queued" },
];

const logRows = [
    { name: "Excel Santos", time: "4:31 PM", status: "Present" },
    { name: "Camille Reyes", time: "4:34 PM", status: "Present" },
    { name: "Andrei Cruz", time: "4:41 PM", status: "Late" },
    { name: "Mika Delgado", time: "Pending", status: "Pending" },
];

const sessionStats = [
    { label: "Checked in", value: "38" },
    { label: "Late", value: "4" },
    { label: "Pending", value: "7" },
];

export default function OfficerAttendancePage() {
    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Attendance</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Live event attendance tracker
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Open a check-in session, mark members as present, and keep a running attendance log for the event.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary">Export log</Button>
                            <Button variant="dark">Open session</Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {sessionStats.map((stat) => (
                            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                            </article>
                        ))}
                    </div>

                    <div className="mt-6">
                        <StatusBanner tone="info" className="border-slate-200 bg-slate-50 text-slate-600">
                            The QR check-in line is live. Manual attendance can be added from the queue below.
                        </StatusBanner>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Input className="max-w-md" placeholder="Search check-in queue" aria-label="Search attendance queue" />
                            <Button variant="secondary">Mark all present</Button>
                        </div>

                        <div className="mt-6 space-y-3">
                            {queue.map((person) => (
                                <div key={person.name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div>
                                        <p className="font-semibold text-slate-900">{person.name}</p>
                                        <p className="mt-1 text-sm text-slate-500">{person.role}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-amber-50 text-amber-700">{person.status}</Badge>
                                        <Button variant="dark">Check in</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>

                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Attendance log</h3>
                            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Member</th>
                                            <th className="px-4 py-3 text-left font-medium">Time</th>
                                            <th className="px-4 py-3 text-left font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {logRows.map((row) => (
                                            <tr key={row.name}>
                                                <td className="px-4 py-4 font-medium text-slate-900">{row.name}</td>
                                                <td className="px-4 py-4 text-slate-600">{row.time}</td>
                                                <td className="px-4 py-4">
                                                    <Badge
                                                        className={
                                                            row.status === "Present"
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : row.status === "Late"
                                                                ? "bg-amber-50 text-amber-700"
                                                                : "bg-slate-100 text-slate-600"
                                                        }
                                                    >
                                                        {row.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Session notes</h3>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                <p>• Keep a paper backup list available for any QR scan failures.</p>
                                <p>• Review late arrivals after the first 15 minutes of the event.</p>
                                <p>• Export the completed log before archiving the event.</p>
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </AuthenticatedShell>
    );
}