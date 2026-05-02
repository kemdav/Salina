'use client';

import { OrgCard, DiscoverOrg } from "@/components/molecules/org-card";
import { useState } from "react";

interface DiscoverOrgGridProps {
    organizations: DiscoverOrg[];
}

export function DiscoverOrgGrid({ organizations }: DiscoverOrgGridProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Simple client-side filtering based on the search query
    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    <button className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium whitespace-nowrap shadow-sm">All Orgs</button>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-sm font-medium whitespace-nowrap">Recruiting Now</button>
                </div>
            </div>

            {/* The Grid */}
            {filteredOrgs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrgs.map(org => (
                        <OrgCard
                            key={org.id}
                            org={org}
                            onApply={(id) => console.log(`Applying to org: ${id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl border-dashed">
                    <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="text-lg font-bold text-slate-700">No organizations found</h3>
                    <p className="text-sm text-slate-500 mt-1">Try adjusting your search criteria.</p>
                </div>
            )}

        </div>
    );
}