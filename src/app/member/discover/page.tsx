'use client';

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { DiscoverOrgGrid } from "@/components/organisms/discover-org";
import { DiscoverOrg } from "@/components/molecules/org-card";

// --- DUMMY DATA FOR THE TENANT (The one the user is currently viewing from) ---
const dummyTenant = {
    name: "Cebu Institute of Technology - Universityy",
    primaryColor: "#c6623e",
    textColor: "#ffffff"
};

// --- DUMMY DATA FOR OTHER ORGANIZATIONS ---
// Notice how each has its own branding and pipeline status!
const discoverableOrgs: DiscoverOrg[] = [
    {
        id: "org-1",
        name: "CodeCrafters Society",
        category: "Academic",
        description: "The official organization for Computer Engineering students. We focus on hackathons, coding workshops, and building hardware prototypes.",
        memberCount: 142,
        branding: {
            primaryColor: "#3b82f6", // Blue
            textColor: "#ffffff",
            fontFamily: "ui-sans-serif, system-ui, sans-serif" // Modern Sans
        },
        pipeline: {
            status: "Open",
            currentStage: "Application Form",
            deadline: "2026-08-15"
        }
    },
    {
        id: "org-2",
        name: "Varsity Debate Team",
        category: "Extracurricular",
        description: "Compete at national and international levels. We train students in critical thinking, public speaking, and policy analysis.",
        memberCount: 45,
        branding: {
            primaryColor: "#7f1d1d", // Deep Red/Burgundy
            textColor: "#ffffff",
            fontFamily: "ui-serif, Georgia, serif" // Elegant Serif
        },
        pipeline: {
            status: "Reviewing",
            currentStage: "Initial Interviews",
        }
    },
    {
        id: "org-3",
        name: "EcoWarriors Network",
        category: "Advocacy",
        description: "Dedicated to campus sustainability. We organize tree-planting events, recycling drives, and environmental awareness seminars.",
        memberCount: 88,
        branding: {
            primaryColor: "#10b981", // Emerald Green
            textColor: "#ffffff",
            fontFamily: "ui-rounded, 'Hiragino Maru Gothic ProN', sans-serif" // Friendly Rounded
        },
        pipeline: {
            status: "Closed",
            currentStage: "Recruitment Ended",
        }
    },
    {
        id: "org-4",
        name: "Campus E-Sports League",
        category: "Sports",
        description: "The official competitive gaming hub. We host tournaments for Valorant, Mobile Legends, and Tekken.",
        memberCount: 210,
        branding: {
            primaryColor: "#8b5cf6", // Purple
            textColor: "#ffffff",
            fontFamily: "ui-monospace, SFMono-Regular, monospace" // Edgy Monospace
        },
        pipeline: {
            status: "Open",
            currentStage: "Tryouts Registration",
            deadline: "2026-05-01"
        }
    }
];

export default function MemberDiscoverPage() {
    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>
            <div className="w-full max-w-6xl mx-auto py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                        Discover Organizations
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                        Find and join communities that match your interests. Applying will automatically submit your Digital ID profile to their recruitment pipeline.
                    </p>
                </div>

                {/* Render the Grid Organism */}
                <DiscoverOrgGrid organizations={discoverableOrgs} />

            </div>
        </AuthenticatedShell>
    );
}