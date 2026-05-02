'use client';

import { useState } from "react";
import { ApplicationCard, ApplicationData } from "@/components/molecules/application-card";
import { cn } from "@/lib/utils";

interface ApplicationListProps {
    applications: ApplicationData[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
    const [activeTab, setActiveTab] = useState<"All" | "Active" | "Past">("All");

    const filteredApps = applications.filter(app => {
        if (activeTab === "Active") return app.status === "Pending" || app.status === "In Review";
        if (activeTab === "Past") return app.status === "Accepted" || app.status === "Rejected";
        return true;
    });

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500">

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                {(["All", "Active", "Past"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-5 py-1.5 rounded-md text-sm font-medium transition-all",
                            activeTab === tab
                                ? "bg-white shadow-sm text-slate-800"
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
                {filteredApps.length > 0 ? (
                    filteredApps.map(app => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onViewDetails={(id) => console.log(`Viewing details for ${id}`)}
                        />
                    ))
                ) : (
                    <div className="py-16 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl border-dashed">
                        <svg className="w-10 h-10 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <h3 className="text-sm font-bold text-slate-700">No applications found</h3>
                        <p className="text-xs text-slate-500 mt-1">You have not submitted any applications in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}