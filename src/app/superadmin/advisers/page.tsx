'use client';

import { useState } from 'react';

const ADVISERS = [
    { initials: 'MG', name: 'Marcus Sterling', email: 'm.sterling@finwealth.com',   org: 'FinWealth Advisors',    submitted: 'Oct 24, 2023', status: 'PENDING' },
    { initials: 'EL', name: 'Elena Lundberg',  email: 'elena.l@nordic-capital.io',  org: 'Nordic Capital',        submitted: 'Oct 23, 2023', status: 'PENDING' },
    { initials: 'UH', name: 'Ulian Harth',     email: 'jharth@peak-advisory.com',  org: 'Peak Advisory Group',   submitted: 'Oct 22, 2023', status: 'PENDING' },
    { initials: 'SC', name: 'Sarah Chen',      email: 's.chen@vanguard-p.com',      org: 'Vanguard Partners',     submitted: 'Oct 22, 2023', status: 'PENDING' },
];

const PAGES = [1, 2, 3];

export default function AdvisersPage() {
    const [filterStatus, setFilterStatus] = useState('Pending');
    const [searchQuery,  setSearchQuery]  = useState('');

    const filtered = ADVISERS.filter((a) => {
        const matchesStatus = filterStatus === 'All Status' || a.status === filterStatus.toUpperCase();
        const q = searchQuery.toLowerCase();
        const matchesSearch = a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    return (
        <div style={{ fontFamily: 'var(--font-body)' }}>
            {/* Header */}
            <h1
                className="text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Adviser Verification
            </h1>

            {/* Filters */}
            <div className="mt-6 mb-6 flex items-center gap-3">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-9 rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-slate-50/50">
                            {['Adviser Name', 'Email', 'Organization', 'Submitted', 'Status', 'Actions'].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                                    No advisers match your filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((adviser) => (
                                <tr
                                    key={adviser.email}
                                    className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                                >
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                                                {adviser.initials}
                                            </div>
                                            <span className="font-medium text-foreground">{adviser.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {adviser.email}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {adviser.org}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {adviser.submitted}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                                            {adviser.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label="Approve"
                                                className="rounded p-1 text-success transition-colors hover:bg-success/10"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Reject"
                                                className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                                            >
                                                ✗
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Showing 1-4 of 36 pending applications
                </p>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="flex h-8 items-center justify-center rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50"
                    >
                        Previous
                    </button>
                    {PAGES.map((page) => (
                        <button
                            key={page}
                            type="button"
                            className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius)] text-sm transition-colors ${
                                page === 1
                                    ? 'bg-foreground text-background'
                                    : 'border border-border bg-white text-foreground hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="flex h-8 items-center justify-center rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
