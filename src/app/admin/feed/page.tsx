'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';

interface Post {
    id: number;
    content: string;
    author: string;
    timestamp: string;
    likes: number;
    replies: number;
}

const INITIAL_POSTS: Post[] = [
    {
        id: 1,
        content: 'Welcome to the new semester! Recruitment opens next Monday. Prepare your applications.',
        author: 'Admin',
        timestamp: '2 hours ago',
        likes: 24,
        replies: 8,
    },
    {
        id: 2,
        content: 'General Assembly this Friday at 6PM in the Main Hall. Attendance is mandatory.',
        author: 'Admin',
        timestamp: 'Yesterday',
        likes: 31,
        replies: 12,
    },
    {
        id: 3,
        content: 'Congratulations to all new members who passed the deliberation stage!',
        author: 'Admin',
        timestamp: '3 days ago',
        likes: 47,
        replies: 15,
    },
];

export default function FeedPage() {
    const [postContent, setPostContent] = useState('');
    const [posts,       setPosts]       = useState<Post[]>(INITIAL_POSTS);

    function handlePost() {
        const trimmed = postContent.trim();
        if (!trimmed) return;
        setPosts((prev) => [
            {
                id: Date.now(),
                content: trimmed,
                author: 'Admin',
                timestamp: 'Just now',
                likes: 0,
                replies: 0,
            },
            ...prev,
        ]);
        setPostContent('');
    }

    return (
        <div style={{ fontFamily: 'var(--font-body)' }}>
            {/* Header */}
            <h1
                className="text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Organization Feed
            </h1>
            <p className="mt-1 text-base text-slate-500">
                Broadcast announcements to your organization.
            </p>

            {/* Post composer */}
            <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    New Announcement
                </p>

                <textarea
                    rows={4}
                    placeholder="Write an announcement..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full resize-none rounded-[var(--radius)] border border-border p-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
                />

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Visible to all members</p>
                    <Button onClick={handlePost}>Post Announcement</Button>
                </div>
            </div>

            {/* Feed posts */}
            <div className="mt-8 space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                    >
                        {/* Top row */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    A
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                                    <p className="text-xs text-slate-500">{post.timestamp}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-slate-400 transition-colors hover:text-foreground"
                            >
                                ⋯
                            </button>
                        </div>

                        {/* Content */}
                        <p className="mt-3 text-sm leading-relaxed text-foreground">
                            {post.content}
                        </p>

                        {/* Reactions */}
                        <div className="mt-4 flex gap-4 border-t border-border pt-4">
                            <span className="text-xs text-slate-500">👍 {post.likes}</span>
                            <span className="text-xs text-slate-500">💬 {post.replies} replies</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
