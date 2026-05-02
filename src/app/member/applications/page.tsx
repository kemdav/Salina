'use client';

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { ApplicationList } from "@/components/organisms/application-list";
import { ApplicationData } from "@/components/molecules/application-card";

// Current Tenant Data
const dummyTenant = {
    name: "Cebu Institute of Technology - University",
    primaryColor: "#c6623e",
    textColor: "#ffffff"
};

// Dummy Data covering all status types!
const myApplications: ApplicationData[] = [
    {
        id: "app-101",
        orgName: "The Racers",
        branding: { primaryColor: "#7f1d1d", textColor: "#ffffff" },
        appliedDate: "April 20, 2026",
        status: "In Review",
        currentStage: "Interview Phase",
        message: "Your application is currently being reviewed by the executive committee. Please keep an eye on your email for an interview schedule."
    },
    {
        id: "app-102",
        orgName: "Tokyo Metropolitan Curse Technical College",
        branding: { primaryColor: "#3b82f6", textColor: "#ffffff" },
        appliedDate: "April 28, 2026",
        status: "Pending",
        currentStage: "Awaiting Initial Screening",
    },
    {
        id: "app-103",
        orgName: "Wildcats E-Sports Lounge",
        branding: { primaryColor: "#8b5cf6", textColor: "#ffffff" },
        appliedDate: "March 15, 2026",
        status: "Accepted",
        currentStage: "Onboarding Completed",
        message: "Welcome to the team! Make sure to attend the general assembly on Friday."
    },
    {
        id: "app-104",
        orgName: "The Seven",
        branding: { primaryColor: "#10b981", textColor: "#ffffff" },
        appliedDate: "January 10, 2026",
        status: "Rejected",
        currentStage: "Closed",
        message: "Thank you for your interest. Unfortunately, we have reached our maximum member capacity for this semester."
    }
];

export default function MemberApplicationsPage() {
    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>
            <div className="w-full max-w-5xl mx-auto py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                        My Applications
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                        Track the status of your membership requests across all organizations.
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* The Application List Organism */}
                    <div className="flex-1 w-full">
                        <ApplicationList applications={myApplications} />
                    </div>

                    {/* Right Sidebar: Info Card */}
                    <div className="w-full lg:w-72 shrink-0 space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Digital ID Sync
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                When you apply to an organization, a snapshot of your Digital ID is shared with their officers.
                            </p>
                            <button className="w-full px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                Update Digital ID
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedShell>
    );
}