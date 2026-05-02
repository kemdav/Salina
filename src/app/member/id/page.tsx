'use client';

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { DigitalIdCard } from "@/components/organisms/digital-id-card";
// 1. Import the download utilities
import { toPng } from 'html-to-image';
import { useState, useCallback } from 'react';

export default function MemberDigitalIdPage() {
    // 2. Add loading state for the button
    const [isDownloading, setIsDownloading] = useState(false);

    const dummyTenant = {
        name: "Cebu Institute of Technology - University",
        primaryColor: "#c6623e",
        textColor: "#ffffff"
    };

    const dummyUser = {
        name: "Jojo Dio",
        role: "Vice President - External",
        idNumber: "CIT-2026-0042",
        issuedOn: "April 15, 2026",
        expiryDate: "April 15, 2027",
        roleLevel: "Tier 2 - Officer",
        accessPermissions: ["Events Management", "Recruitment Pipeline", "Member Roster"],
        avatarUrl: ""
    };

    // 3. The magic function that takes a picture of the ID and downloads it
    const handleDownload = useCallback(() => {
        const cardElement = document.getElementById('digital-id-badge');
        if (!cardElement) return;

        setIsDownloading(true);

        // Takes a high-quality (pixelRatio: 2) snapshot of the component
        toPng(cardElement, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                // Formats the file name based on the user's name!
                link.download = `Salina-ID-${dummyUser.name.replace(/\s+/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Failed to download badge', err);
            })
            .finally(() => {
                setIsDownloading(false);
            });
    }, [dummyUser.name]);

    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>

            <div className="w-full max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

                    {/* The ID Card */}
                    <div className="w-full lg:w-[60%] flex justify-center lg:justify-start">
                        <DigitalIdCard tenant={dummyTenant} user={dummyUser} />
                    </div>

                    {/* Actions Panel */}
                    <div className="flex-1 flex flex-col gap-6 w-full lg:w-[40%]">
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">ID Card Actions</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Download a secure PDF copy of your ID to your device, or share a verification link directly with campus security.
                            </p>

                            <div className="flex flex-col xl:flex-row gap-3">
                                {/* 4. Attach the click handler to the button! */}
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    {isDownloading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Downloading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </span>
                                    )}
                                </button>

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
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Security Warning</h4>
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                    This digital ID is uniquely cryptographically tied to your account. Do not post screenshots of the QR code publicly.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedShell>
    );
}