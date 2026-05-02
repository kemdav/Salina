import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";

export interface FeedPostData {
    title: string;
    category: string;
    author: string;
    time: string;
    body: string;
    stats: string;
}

interface FeedPostProps {
    post: FeedPostData;
}

export function FeedPost({ post }: FeedPostProps) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <Badge className="bg-slate-900 text-white">{post.category}</Badge>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{post.author}</p>
                </div>

                <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                    {post.time}
                </span>
            </div>

            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
                {post.body}
            </p>

            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">{post.stats}</p>
                <div className="flex gap-3">
                    <Button variant="secondary">Reply</Button>
                    <Button variant="secondary">Boost</Button>
                </div>
            </div>
        </article>
    );
}