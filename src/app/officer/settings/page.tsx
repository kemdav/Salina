import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { FormDivider } from "@/components/molecules/form-divider";
import { StatusBanner } from "@/components/molecules/status-banner";
import { TextField } from "@/components/molecules/text-field";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data";

const preferenceItems = [
    {
        label: "Attendance summaries",
        description: "Send a digest after every event check-in closes.",
        checked: true,
    },
    {
        label: "Feed moderation alerts",
        description: "Notify you when another officer edits or pins a post.",
        checked: true,
    },
    {
        label: "Recruitment reminders",
        description: "Surface overdue reviews for the officer pipeline.",
        checked: false,
    },
];

const recentChanges = [
    "Display name updated for the officer workspace header.",
    "Attendance reminders enabled for evening events.",
    "Recruitment digest set to weekly delivery.",
];

export default function OfficerSettingsPage() {
    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <Badge className="bg-[#c6623e] text-white">Officer settings</Badge>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                                    Personal profile and limited organization options
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Adjust your officer-facing profile and the notification surface you use every day.
                                </p>
                            </div>
                        </div>

                        <StatusBanner tone="info" className="max-w-md border-slate-200 bg-slate-50 text-slate-600">
                            Officer settings only control the local workspace view and never expose superadmin controls.
                        </StatusBanner>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                    <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                        <FormDivider label="Profile" />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                id="display-name"
                                label="Display name"
                                defaultValue="Excel Santos"
                                helperText="Shown in the sidebar and top-level officer cards."
                            />
                            <TextField
                                id="role-title"
                                label="Role title"
                                defaultValue="Human Resources Officer"
                                helperText="Use the title your team recognizes."
                            />
                            <TextField
                                id="email"
                                label="Email"
                                defaultValue="excel.santos@cit.edu.ph"
                                helperText="Used for officer notifications."
                            />
                            <TextField
                                id="phone"
                                label="Phone number"
                                defaultValue="+63 912 345 6789"
                                helperText="Optional but recommended for urgent coordination."
                            />
                        </div>

                        <FormDivider label="Notification preferences" />

                        <div className="space-y-3">
                            {preferenceItems.map((item) => (
                                <label key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <input
                                        type="checkbox"
                                        defaultChecked={item.checked}
                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                                    />
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                                        <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
                                    </span>
                                </label>
                            ))}
                        </div>

                        <FormDivider label="Workspace defaults" />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    className="block text-xs font-medium uppercase tracking-[0.06em] text-[#6B7280]"
                                    htmlFor="default-view"
                                >
                                    Default landing page
                                </label>
                                <select
                                    id="default-view"
                                    defaultValue="dashboard"
                                    className="mt-1 block w-full rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                >
                                    <option value="dashboard">Dashboard</option>
                                    <option value="feed">Feed</option>
                                    <option value="attendance">Attendance</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-medium uppercase tracking-[0.06em] text-[#6B7280]"
                                    htmlFor="default-channel"
                                >
                                    Notification channel
                                </label>
                                <select
                                    id="default-channel"
                                    defaultValue="email"
                                    className="mt-1 block w-full rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                >
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                    <option value="in-app">In-app only</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button variant="secondary">Discard changes</Button>
                            <Button variant="dark">Save settings</Button>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Officer access</h3>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                <li>• Manage feed posts and officer-only announcements.</li>
                                <li>• Update attendance preferences for live events.</li>
                                <li>• Review recruitment and event workflow notifications.</li>
                            </ul>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Recent changes</h3>
                            <div className="mt-4 space-y-3">
                                {recentChanges.map((change) => (
                                    <div key={change} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                        {change}
                                    </div>
                                ))}
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </AuthenticatedShell>
    );
}