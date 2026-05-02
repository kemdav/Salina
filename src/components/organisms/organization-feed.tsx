'use client';

import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { TextField } from "@/components/molecules/text-field";
import { StatusBanner } from "@/components/molecules/status-banner";
import { FeedPost, FeedPostData } from "@/components/molecules/feed-post";

interface OrganizationFeedProps {
    posts: FeedPostData[];
    canPost?: boolean;
    primaryColor?: string; // Allows the badge to match the tenant's color!
}

const audienceTags = ["Officers", "Members", "Advisers"];

export function OrganizationFeed({ posts, canPost = false, primaryColor = "#c6623e" }: OrganizationFeedProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

            {/* CONDITIONAL PUBLISHING SECTION */}
            {canPost && (
                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
                        <Badge style={{ backgroundColor: primaryColor, color: "#fff" }}>Announcement feed</Badge>
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
                                <Badge key={tag} className="border border-slate-200 bg-slate-50 text-slate-700">
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
            )}

            {/* FEED POSTS SECTION - Rendered for EVERYONE */}
            <section className="space-y-4">
                {posts.map((post, index) => (
                    // Using index as fallback key, though post.id is better if you have one
                    <FeedPost key={post.title + index} post={post} />
                ))}
            </section>
        </div>
    );
}