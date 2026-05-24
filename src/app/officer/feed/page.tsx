import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { TextField } from "@/components/molecules/text-field";
import { StatusBanner } from "@/components/molecules/status-banner";

const audienceTags = ["Officers", "Members", "Advisers"];

const feedPosts = [
    {
        title: "Weekend outreach schedule confirmed",
        category: "Operations",
        author: "Secretariat Office",
        time: "12 minutes ago",
        body: "The outreach team will gather at 7:30 AM on Saturday. Logistics, name tags, and transportation are already locked in.",
        stats: "17 reads · 4 acknowledgements",
    },
    {
        title: "Recruitment interview panel needs one more reviewer",
        category: "Recruitment",
        author: "Vice President for External",
        time: "1 hour ago",
        body: "Please react to the thread if you can sit in on the final round. The newest applicant batch is ready for officer scoring.",
        stats: "9 reads · 2 replies",
    },
    {
        title: "Attendance sheet updated for the annual assembly",
        category: "Attendance",
        author: "Attendance Committee",
        time: "Today at 8:15 AM",
        body: "The QR check-in link has been regenerated and the backup manual list is ready at the registration desk.",
        stats: "23 reads · 6 confirmations",
    },
];

export default function OfficerFeedPage() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                    <Badge className="bg-[var(--primary)] text-white">Announcement feed</Badge>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                            Publish organization updates
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                            Share officer directives, event reminders, and recruitment notes without leaving the command center.
                        </p>

                        <div className="mt-6 grid gap-4">
                            <TextField id="announcement-title" label="Headline" placeholder="Ex: Attendance opens at 4:30 PM" helperText="Keep the title short and action-oriented." />

                            <div>
                                <label htmlFor="announcement-body" className="block text-xs font-medium uppercase tracking-[0.06em] text-[#6B7280]">Message</label>
                                <textarea
                                    id="announcement-body"
                                    rows={6}
                                    className="mt-1 block w-full rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-3 text-sm text-foreground outline-none transition duration-200 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                                    placeholder="Write the announcement body here."
                                    defaultValue="Attendance opens at 4:30 PM. Please review the check-in queue and keep the event desk clear for guests."
                                />
                            </div>

                            <Input placeholder="Add a reference tag, like #attendance or #events" aria-label="Announcement tag" />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {audienceTags.map((tag) => (
                                <Badge key={tag} className="border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <StatusBanner tone="info" className="border-slate-200 bg-slate-50">
                                Drafts stay private until you publish them to the officer feed.
                            </StatusBanner>

                            <div className="flex gap-3">
                                <Button variant="secondary">Save draft</Button>
                                <Button variant="dark">Publish update</Button>
                            </div>
                        </div>
                    </article>

                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Posting controls</h3>
                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Audience</p>
                                    <p className="mt-2 text-base font-semibold text-slate-900">Officers and members</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Draft queue</p>
                                    <p className="mt-2 text-base font-semibold text-slate-900">3 posts awaiting approval</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Pinned notices</p>
                                    <p className="mt-2 text-base font-semibold text-slate-900">2 active notices on top of the feed</p>
                                </div>
                            </div>
                        </article>

                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Feed rules</h3>
                            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                                <li>• Keep posts concise and action-focused.</li>
                                <li>• Tag attendance or event posts so officers can filter quickly.</li>
                                <li>• Use the draft queue when a message still needs approval.</li>
                            </ul>
                        </article>
                    </aside>
                </section>

                <section className="space-y-4">
                    {feedPosts.map((post) => (
                        <article key={post.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <Badge className="bg-slate-900 text-white">{post.category}</Badge>
                                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h3>
                                    <p className="mt-2 text-sm text-slate-500">{post.author}</p>
                                </div>

                                <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{post.time}</span>
                            </div>

                            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">{post.body}</p>

                            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">{post.stats}</p>
                                <div className="flex gap-3">
                                    <Button variant="secondary">Reply</Button>
                                    <Button variant="secondary">Boost</Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
    );
}