import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/atoms/status-badge";

export type ApplicationStatus = "Pending" | "In Review" | "Accepted" | "Rejected";

export interface ApplicationData {
    id: string;
    orgName: string;
    branding: {
        primaryColor: string;
        textColor: string;
    };
    appliedDate: string;
    status: ApplicationStatus;
    currentStage: string;
    message?: string;
}

interface ApplicationCardProps {
    application: ApplicationData;
    onViewDetails?: (id: string) => void;
}

export function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
    // Helper to map application status to our atom's 3 color variants
    const getBadgeVariant = (status: ApplicationStatus) => {
        if (status === "Accepted") return "green";
        if (status === "Rejected") return "red";
        return "yellow"; // Pending or In Review
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:items-center">

            {/* 1. Org Logo/Initial */}
            <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold shrink-0 shadow-sm"
                style={{ backgroundColor: application.branding.primaryColor, color: application.branding.textColor }}
            >
                {application.orgName.charAt(0)}
            </div>

            {/* 2. Main Details */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-800 truncate">
                        {application.orgName}
                    </h3>
                    <StatusBadge variant={getBadgeVariant(application.status)}>
                        {application.status}
                    </StatusBadge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium">Stage: <span className="text-slate-700">{application.currentStage}</span></span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span>Applied on {application.appliedDate}</span>
                </div>

                {/* Optional Message/Action Item */}
                {application.message && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="leading-relaxed">{application.message}</span>
                    </div>
                )}
            </div>

            {/* 3. Actions */}
            <div className="shrink-0 flex sm:flex-col gap-2 mt-2 sm:mt-0 sm:pl-4 sm:border-l border-slate-100">
                <button
                    onClick={() => onViewDetails && onViewDetails(application.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                    View Status
                </button>
                {(application.status === "Pending" || application.status === "In Review") && (
                    <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Withdraw
                    </button>
                )}
            </div>
        </div>
    );
}