import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/atoms/status-badge"; // 1. Import our new Atom!

export interface OrgBranding {
    primaryColor: string;
    textColor: string;
    fontFamily: string;
}

export interface OrgPipeline {
    status: "Open" | "Reviewing" | "Closed";
    currentStage: string;
    deadline?: string;
}

export interface DiscoverOrg {
    id: string;
    name: string;
    category: string;
    description: string;
    memberCount: number;
    branding: OrgBranding;
    pipeline: OrgPipeline;
}

interface OrgCardProps {
    org: DiscoverOrg;
    onApply?: (orgId: string) => void;
}

export function OrgCard({ org, onApply }: OrgCardProps) {
    const isOpen = org.pipeline.status === "Open";

    // 2. A simple helper function to determine which color variant to use
    const getStatusVariant = (status: string) => {
        if (status === "Open") return "green";
        if (status === "Reviewing") return "yellow";
        return "red";
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">

            {/* Themed Header Banner */}
            <div
                className="h-24 relative p-5 flex items-start justify-between shrink-0"
                style={{ backgroundColor: org.branding.primaryColor }}
            >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />

                {/* 3. Our New StatusBadge Atom! */}
                <StatusBadge
                    variant={getStatusVariant(org.pipeline.status)}
                    className="relative z-10"
                >
                    {isOpen ? "Recruiting" : org.pipeline.status}
                </StatusBadge>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-1 relative">
                {/* Simulated Logo */}
                <div
                    className="absolute -top-8 left-5 w-14 h-14 rounded-xl border-4 border-white flex items-center justify-center shadow-sm text-lg font-bold"
                    style={{ backgroundColor: org.branding.primaryColor, color: org.branding.textColor }}
                >
                    {org.name.charAt(0)}
                </div>

                <div className="mt-6 mb-2">
                    <h3
                        className="text-xl font-bold text-slate-800 leading-tight"
                        style={{ fontFamily: org.branding.fontFamily }}
                    >
                        {org.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{org.memberCount} Active Members</p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                    {org.description}
                </p>

                {/* Pipeline Info & Action */}
                <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Phase</p>
                        <p className="text-xs font-semibold text-slate-700">{org.pipeline.currentStage}</p>
                    </div>

                    <button
                        onClick={() => onApply && onApply(org.id)}
                        disabled={!isOpen}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm",
                            isOpen
                                ? "text-white hover:opacity-90"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                        style={isOpen ? { backgroundColor: org.branding.primaryColor } : {}}
                    >
                        {isOpen ? "Apply Now" : "Closed"}
                    </button>
                </div>
            </div>
        </div>
    );
}