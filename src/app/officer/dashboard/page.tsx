'use client';

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";

export default function OfficerDashboardPage() {

    // --- 1. Dummy Tenant Data (Perfectly matched to the Member ID context) ---
    const dummyTenant = {
        name: "Cebu Institute of Technology - University",
        primaryColor: "#c6623e",
        textColor: "#ffffff"
    };

    // --- 2. Dummy Metrics for the Cards ---
    const metrics = [
        { title: "Active Members", value: "142", trend: "+12 this semester", color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Pending Applications", value: "8", trend: "Awaiting review", color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Upcoming Events", value: "2", trend: "Next: CPE Challenge", color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Task Delegations", value: "5", trend: "Requires attention", color: "text-purple-600", bg: "bg-purple-50" }
    ];

    return (
        <AuthenticatedShell role="Officer" tenantBranding={dummyTenant}>

            <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1 h-full overflow-y-auto">

                {/* 1. Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                            Welcome back, Excel
                        </h2>
                        <p className="text-slate-500 mt-1">
                            Human Resources • Here is what is happening in your organization today.
                        </p>
                    </div>
                    {/* Themed Primary Button */}
                    <button
                        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 shadow-sm flex items-center gap-2 w-fit"
                        style={{ backgroundColor: dummyTenant.primaryColor, color: dummyTenant.textColor }}
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Announcement
                    </button>
                </div>

                {/* 2. Top-Level Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">{metric.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-800">{metric.value}</span>
                            </div>
                            <div className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${metric.bg} ${metric.color}`}>
                                {metric.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. Two-Column Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Wider): Actionable Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Recent Applications</h3>
                                <button
                                    className="text-sm font-medium hover:opacity-80"
                                    style={{ color: dummyTenant.primaryColor }}
                                >
                                    View Pipeline &rarr;
                                </button>
                            </div>

                            {/* Empty State / List */}
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-slate-600">Application pipeline is empty.</span>
                                <span className="text-xs text-slate-400 mt-1">New member requests will appear here.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Narrow): Quick Tools */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Tools</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-700 group">
                                    <span className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Create Event
                                    </span>
                                    <span className="text-slate-400 group-hover:text-slate-600">&rarr;</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-700 group">
                                    <span className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export Attendance Log
                                    </span>
                                    <span className="text-slate-400 group-hover:text-slate-600">&rarr;</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left text-sm font-medium text-slate-700 group">
                                    <span className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Manage Roles
                                    </span>
                                    <span className="text-slate-400 group-hover:text-slate-600">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedShell>
    );
}