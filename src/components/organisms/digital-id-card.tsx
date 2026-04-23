'use client';

import { cn } from "@/lib/utils";

interface TenantBranding {
    name: string;
    logo?: string;
    primaryColor: string;
    textColor: string;
}

interface UserDetails {
    name: string;
    role: string;
    idNumber: string;
    issuedOn: string;
    expiryDate: string;
    roleLevel: string;
    accessPermissions: string[];
    avatarUrl?: string; // This is optional btw this only for the sake of the avatar fallback logic, if no URL is provided it will just show the gray background instead of trying to load an image.
}

interface DigitalIdCardProps {
    tenant: TenantBranding;
    user: UserDetails;
}

export function DigitalIdCard({ tenant, user }: DigitalIdCardProps) {
    return (
        <div className="w-full max-w-[640px] mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col sm:flex-row relative group">

            {/* LEFT COLUMN: Branding & Avatar */}
            <div
                className="sm:w-[40%] flex flex-col items-center justify-center p-8 relative border-b sm:border-b-0 sm:border-r border-black/10"
                style={{ backgroundColor: tenant.primaryColor, color: tenant.textColor }}
            >
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />

                {/* Avatar Area  */}
                <div className="relative group/avatar cursor-pointer z-10 mb-6">
                    <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-xl">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            // THE NEW SOLID SILHOUETTE DEFAULT ICON
                            <svg className="w-20 h-20 text-slate-300 mt-6" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                </div>

                {/* Tenant Info */}
                <div className="text-center z-10 w-full">
                    <h2 className="text-[17px] font-bold leading-tight font-[family:var(--font-heading)] tracking-tight mb-1">
                        {tenant.name}
                    </h2>
                    <h3 className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
                        Official Digital ID
                    </h3>
                </div>
            </div>

            {/* RIGHT COLUMN: User Details & Security Data */}
            <div className="sm:w-[60%] flex flex-col p-6 sm:p-8 relative">

                {/* Header: Name, Role, and QR Code */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">
                            {user.name}
                        </h1>
                        <span
                            className="inline-block px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm"
                            style={{ backgroundColor: `${tenant.primaryColor}15`, color: tenant.primaryColor, border: `1px solid ${tenant.primaryColor}30` }}
                        >
                            {user.role}
                        </span>
                    </div>

                    {/* QR Code */}
                    <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] shrink-0 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md border border-slate-200">
                        <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2z" />
                        </svg>
                    </div>
                </div>

                {/* Grid: Secondary Details */}
                <div className="py-6 grid grid-cols-2 gap-y-5 gap-x-4 text-sm flex-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">ID Number</span>
                        <span className="font-mono font-medium text-slate-700">{user.idNumber}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Role Lvl</span>
                        <span className="font-medium text-slate-700">{user.roleLevel}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Issued On</span>
                        <span className="font-medium text-slate-700">{user.issuedOn}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">Valid Until</span>
                        <span className="font-medium text-red-600">{user.expiryDate}</span>
                    </div>
                </div>

                {/* Footer: Access Permissions */}
                <div className="pt-5 border-t border-slate-100 mt-auto">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2 block">Access Permissions</span>
                    <div className="flex flex-wrap gap-1.5">
                        {user.accessPermissions.map((perm, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-medium tracking-wide">
                                {perm}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}