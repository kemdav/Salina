'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';

type Status = 'Active' | 'Probation' | 'Alumni' | 'Suspended';
type Dues   = 'Paid' | 'Unpaid';

interface Member {
    initials: string;
    name: string;
    email: string;
    status: Status;
    dues: Dues;
    tags: string[];
    joined: string;
}

const MEMBERS: Member[] = [
    { initials: 'JD', name: 'John Doe',        email: 'john@org.com',  status: 'Active',    dues: 'Paid',   tags: ['Officer'], joined: 'Jan 2023' },
    { initials: 'AS', name: 'Anna Smith',       email: 'anna@org.com',  status: 'Active',    dues: 'Unpaid', tags: [],          joined: 'Feb 2023' },
    { initials: 'RJ', name: 'Robert Johnson',   email: 'rj@org.com',    status: 'Probation', dues: 'Paid',   tags: [],          joined: 'Mar 2023' },
    { initials: 'ML', name: 'Maria Lopez',      email: 'maria@org.com', status: 'Active',    dues: 'Paid',   tags: ['Officer'], joined: 'Mar 2023' },
    { initials: 'TK', name: 'Tom Kim',          email: 'tom@org.com',   status: 'Alumni',    dues: 'Paid',   tags: [],          joined: 'Apr 2022' },
    { initials: 'EW', name: 'Emma Wilson',      email: 'emma@org.com',  status: 'Active',    dues: 'Unpaid', tags: [],          joined: 'Jun 2023' },
    { initials: 'CB', name: 'Chris Brown',      email: 'chris@org.com', status: 'Active',    dues: 'Paid',   tags: [],          joined: 'Jul 2023' },
    { initials: 'NJ', name: 'Nina Jones',       email: 'nina@org.com',  status: 'Probation', dues: 'Unpaid', tags: [],          joined: 'Sep 2023' },
];

const STATUS_CLASS: Record<Status, string> = {
    Active:    'rounded-full bg-success/10 text-success border-success/30',
    Probation: 'rounded-full bg-warning/10 text-warning border-warning/30',
    Alumni:    'rounded-full bg-slate-100 text-slate-500 border-slate-200',
    Suspended: 'rounded-full bg-destructive/10 text-destructive border-destructive/30',
};

const DUES_CLASS: Record<Dues, string> = {
    Paid:   'rounded-full bg-success/10 text-success border-transparent',
    Unpaid: 'rounded-full bg-destructive/10 text-destructive border-transparent',
};

export default function MembersPage() {
    const [searchQuery,  setSearchQuery]  = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterTag,    setFilterTag]    = useState('All Tags');

    const filtered = MEMBERS.filter((m) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
        const matchesStatus = filterStatus === 'All Status' || m.status === filterStatus;
        const matchesTag    = filterTag === 'All Tags' ||
            (filterTag === 'Paid'    && m.dues === 'Paid')   ||
            (filterTag === 'Unpaid'  && m.dues === 'Unpaid') ||
            (filterTag === 'Officer' && m.tags.includes('Officer'));
        return matchesSearch && matchesStatus && matchesTag;
    });

    return (
        <div style={{ fontFamily: 'var(--font-body)' }}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1
                        className="text-3xl font-bold tracking-tight text-foreground"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Roster
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">124 total members</p>
                </div>
                <Button>+ Invite Member</Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center gap-3">
                <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64"
                />

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-9 rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Probation</option>
                    <option>Alumni</option>
                    <option>Suspended</option>
                </select>

                <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="h-9 rounded-[var(--radius)] border border-border bg-white px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                    <option>All Tags</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Officer</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-slate-50/50">
                            {['Member', 'Email', 'Status', 'Dues', 'Tags', 'Joined', 'Actions'].map((col) => (
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
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                                    No members match your filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((member) => (
                                <tr
                                    key={member.email}
                                    className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                                >
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                {member.initials}
                                            </div>
                                            <span className="font-medium text-foreground">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {member.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={STATUS_CLASS[member.status]}>
                                            {member.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={DUES_CLASS[member.dues]}>
                                            {member.dues}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {member.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    className="rounded-full bg-accent/10 text-accent border-transparent"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {member.joined}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            className="text-slate-400 transition-colors hover:text-foreground"
                                        >
                                            ⋯
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
