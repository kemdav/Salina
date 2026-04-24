'use client';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';

interface Applicant {
    initials: string;
    name: string;
    email: string;
    date: string;
    stage: string;
    pillClass: string;
    pillLabel: string;
}

const COLUMNS: { id: string; label: string; applicants: Applicant[] }[] = [
    {
        id: 'application',
        label: 'Application',
        applicants: [
            { initials: 'JD', name: 'Jane Doe',   email: 'jane@email.com',  date: 'Applied Apr 20',      stage: 'Application',  pillClass: 'bg-primary/10 text-primary border-primary/30',    pillLabel: 'New'        },
            { initials: 'MS', name: 'Mike Smith',  email: 'mike@email.com',  date: 'Applied Apr 21',      stage: 'Application',  pillClass: 'bg-primary/10 text-primary border-primary/30',    pillLabel: 'New'        },
            { initials: 'LC', name: 'Lisa Chen',   email: 'lisa@email.com',  date: 'Applied Apr 22',      stage: 'Application',  pillClass: 'bg-primary/10 text-primary border-primary/30',    pillLabel: 'New'        },
        ],
    },
    {
        id: 'screening',
        label: 'Screening',
        applicants: [
            { initials: 'RK', name: 'Ryan Kim',   email: 'ryan@email.com',  date: 'Screened Apr 18',     stage: 'Screening',    pillClass: 'bg-warning/10 text-warning border-warning/30',    pillLabel: 'In Review'  },
            { initials: 'AP', name: 'Amy Park',   email: 'amy@email.com',   date: 'Screened Apr 19',     stage: 'Screening',    pillClass: 'bg-warning/10 text-warning border-warning/30',    pillLabel: 'In Review'  },
        ],
    },
    {
        id: 'interview',
        label: 'Interview',
        applicants: [
            { initials: 'BJ', name: 'Bob Jones',  email: 'bob@email.com',   date: 'Interview Apr 15',    stage: 'Interview',    pillClass: 'bg-accent/10 text-accent border-accent/30',       pillLabel: 'Scheduled'  },
            { initials: 'SW', name: 'Sara White',  email: 'sara@email.com',  date: 'Interview Apr 16',    stage: 'Interview',    pillClass: 'bg-accent/10 text-accent border-accent/30',       pillLabel: 'Scheduled'  },
        ],
    },
    {
        id: 'deliberation',
        label: 'Deliberation',
        applicants: [
            { initials: 'TL', name: 'Tom Lee',    email: 'tom@email.com',   date: 'Final Review Apr 10', stage: 'Deliberation', pillClass: 'bg-success/10 text-success border-success/30',    pillLabel: 'Final'      },
        ],
    },
];

const MOCK_DOCS = ['Resume.pdf', 'Cover Letter.pdf', 'ID Document.pdf'];

export default function RecruitmentPage() {
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

    return (
        <div
            className="flex -m-6 sm:-m-8 min-h-[calc(100vh-4rem)]"
            style={{ fontFamily: 'var(--font-body)' }}
        >
            {/* Kanban area */}
            <div className="min-w-0 flex-1 overflow-y-auto p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1
                        className="text-3xl font-bold tracking-tight text-foreground"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Recruitment Pipeline
                    </h1>
                    <Button>+ New Stage</Button>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-4 gap-4">
                    {COLUMNS.map((col) => (
                        <div
                            key={col.id}
                            className="min-h-[500px] rounded-2xl border border-border bg-slate-50 p-4"
                        >
                            {/* Column header */}
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                    {col.label}
                                </span>
                                <span className="rounded-full border border-border bg-white px-2 py-0.5 text-xs text-slate-500">
                                    {col.applicants.length}
                                </span>
                            </div>

                            {/* Cards */}
                            {col.applicants.map((applicant) => (
                                <div
                                    key={applicant.email}
                                    onClick={() => setSelectedApplicant(
                                        selectedApplicant?.email === applicant.email ? null : applicant
                                    )}
                                    className="mb-3 cursor-pointer rounded-xl border border-border bg-white p-4 shadow-sm transition-colors hover:border-primary/30"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {applicant.initials}
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            {applicant.name}
                                        </span>
                                    </div>
                                    <p className="mb-2 text-xs text-slate-500">{applicant.date}</p>
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${applicant.pillClass}`}>
                                        {applicant.pillLabel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail panel */}
            {selectedApplicant && (
                <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-white p-6">
                    {/* Close */}
                    <button
                        type="button"
                        onClick={() => setSelectedApplicant(null)}
                        className="mb-4 self-end text-xs text-slate-400 transition-colors hover:text-foreground"
                    >
                        ✕ Close
                    </button>

                    {/* Avatar + name */}
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                            {selectedApplicant.initials}
                        </div>
                        <h2
                            className="text-lg font-bold text-foreground"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            {selectedApplicant.name}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">{selectedApplicant.email}</p>
                    </div>

                    {/* Details */}
                    <div className="mb-6 space-y-3 rounded-xl border border-border p-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                Applied
                            </p>
                            <p className="mt-0.5 text-sm text-foreground">{selectedApplicant.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                Current Stage
                            </p>
                            <span className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${selectedApplicant.pillClass}`}>
                                {selectedApplicant.stage}
                            </span>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-6">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                            Documents
                        </p>
                        <div className="space-y-2">
                            {MOCK_DOCS.map((doc) => (
                                <div
                                    key={doc}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-slate-50 px-3 py-2"
                                >
                                    <span className="text-slate-400 text-sm">📄</span>
                                    <span className="text-xs font-medium text-foreground">{doc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex gap-2">
                        <Button variant="secondary" className="flex-1">
                            Reject
                        </Button>
                        <Button className="flex-1">
                            Approve
                        </Button>
                    </div>
                </aside>
            )}
        </div>
    );
}
