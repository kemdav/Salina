import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

const calendarDays = Array.from({ length: 35 }, (_, index) => index + 1);

const eventList = [
    { date: "Apr 30", title: "Officer strategy meeting", time: "6:00 PM", status: "Planning" },
    { date: "May 04", title: "Campus outreach drive", time: "8:00 AM", status: "Public" },
    { date: "May 11", title: "Annual assembly", time: "5:30 PM", status: "High priority" },
];

export default function OfficerEventsPage() {
    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Events</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Calendar and list view for upcoming events
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Plan the semester schedule, keep deadlines visible, and coordinate event logistics from one place.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary">Publish schedule</Button>
                            <Button variant="dark">Create event</Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">May 2026</h3>
                                <p className="mt-1 text-sm text-slate-500">Calendar view with highlighted event dates</p>
                            </div>
                            <Badge className="bg-slate-50 text-slate-600 border border-slate-200">Month view</Badge>
                        </div>

                        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <span key={day}>{day}</span>
                            ))}
                        </div>

                        <div className="mt-3 grid grid-cols-7 gap-2">
                            {calendarDays.map((day) => {
                                const isHighlighted = [4, 10, 18, 25].includes(day);
                                return (
                                    <div
                                        key={day}
                                        className={`min-h-24 rounded-2xl border p-3 text-sm ${isHighlighted ? "border-[#c6623e] bg-[#c6623e]/5" : "border-slate-200 bg-slate-50"}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <span className="font-semibold text-slate-900">{day}</span>
                                            {isHighlighted ? <span className="h-2.5 w-2.5 rounded-full bg-[#c6623e]" /> : null}
                                        </div>
                                        {isHighlighted ? <p className="mt-4 text-xs leading-5 text-slate-600">Scheduled officer activity</p> : null}
                                    </div>
                                );
                            })}
                        </div>
                    </article>

                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Upcoming events</h3>
                            <div className="mt-4 space-y-3">
                                {eventList.map((event) => (
                                    <div key={event.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <Badge className="bg-white text-slate-700 border border-slate-200">{event.status}</Badge>
                                            <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{event.date}</span>
                                        </div>
                                        <h4 className="mt-3 text-lg font-semibold text-slate-900">{event.title}</h4>
                                        <p className="mt-2 text-sm text-slate-500">{event.time}</p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Event planning notes</h3>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                <p>• Keep venue changes pinned to the top of the feed.</p>
                                <p>• Attach attendance instructions when a QR session is required.</p>
                                <p>• Export the calendar view before distributing to the organization.</p>
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </AuthenticatedShell>
    );
}