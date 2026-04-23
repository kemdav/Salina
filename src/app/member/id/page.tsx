'use client';

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { DigitalIdCard } from "@/components/organisms/digital-id-card";

export default function MemberDigitalIdPage() {

    // --- 1. Dummy Tenant Data ---
    const dummyTenant = {
        name: "Cebu Institute of Technology - University",
        primaryColor: "#c6623e",
        textColor: "#ffffff"
    };

    // --- 2. Dummy Member Data ---
    const dummyUser = {
        name: "Wilfred Justin Peteros",
        role: "Vice President - External",
        idNumber: "CIT-2026-0042",
        issuedOn: "April 15, 2026",
        expiryDate: "April 15, 2027",
        roleLevel: "Member",
        accessPermissions: ["Event Check-In", "Venue Access", "Member Portal"],
        avatarUrl: ""
    };

    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>

            {/* FIX 1: Removed the extra flex-1 and overflow classes that were fighting the Shell */}
            <div className="w-full max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* FIX 2: Changed md:flex-row to lg:flex-row so it only goes side-by-side on large screens */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

                    {/* FIX 3: Removed shrink-0 so the card is allowed to resize cleanly */}
                    <div className="w-full lg:w-[60%] flex justify-center lg:justify-start">
                        <DigitalIdCard tenant={dummyTenant} user={dummyUser} />
                    </div>

                    {/* Right Side: Actions & Emphasis */}
                    <div className="flex-1 flex flex-col gap-6 w-full lg:w-[40%]">

                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">ID Card Actions</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Download a secure PDF copy of your ID to your device, or share a verification link directly with campus security. This is your official organizational credential; present the QR code for event check-ins and venue access.
                            </p>

                            <div className="flex flex-col xl:flex-row gap-3">
                                {/* Primary Download Button */}
                                <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                </button>

                                {/* Secondary Share Button */}
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share Link
                                </button>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
                            <div className="text-amber-600 mt-0.5 shrink-0">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Security Warning</h4>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    This digital ID is uniquely cryptographically tied to your account. Do not post screenshots of the QR code publicly, as it contains sensitive attendance routing data.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedShell>
    );
}