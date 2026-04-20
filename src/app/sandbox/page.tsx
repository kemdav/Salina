'use client';

import { useState } from 'react';
import { AuthenticatedShell } from '@/components/templates/authenticated-shell';
import { UserRole } from '@/lib/navigation-config';

export default function SandboxPage() {
    // State to control what the shell displays
    const [role, setRole] = useState<UserRole>('Admin');
    const [useBranding, setUseBranding] = useState(true);

    // Dummy tenant data mimicking what the Onboarding Wizard saves
    const dummyTenant = {
        name: "Cebu Institute of Technology",
        primaryColor: "#c6623e", // Salina/CIT-U primary color
        textColor: "#ffffff"
    };

    return (
        <AuthenticatedShell 
            role={role} 
            tenantBranding={useBranding ? dummyTenant : undefined}
        >
            <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Sidebar Testing Sandbox</h1>
                <p className="text-sm text-slate-500 mb-8">
                    Use the controls below to change the application state and watch the layout shell react.
                </p>
                
                <div className="flex flex-col gap-8">
                    {/* Role Switcher */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Switch Active Role
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {(['SuperAdmin', 'Admin', 'Officer', 'Member'] as UserRole[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        role === r 
                                        ? 'bg-slate-800 text-white shadow-sm' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Branding Switcher */}
                    <div className="pt-6 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Tenant Branding Status
                        </h3>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setUseBranding(!useBranding)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    useBranding 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {useBranding ? 'Branding: ON (Custom Tenant)' : 'Branding: OFF (No Branding)'}
                            </button>
                            <p className="text-xs text-slate-400 max-w-xs">
                                Note: SuperAdmin strictly ignores this setting and forces the default dark theme.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedShell>
    );
}