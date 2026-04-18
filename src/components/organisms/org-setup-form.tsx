'use client';

import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";

export function OrgSpaceSetupForm() {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h1 className="text-sm font-light text-[var(--muted)] uppercase tracking-wide mb-2">
                    ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">ORGANIZATION DETAILS</span>
                </h1>

                <h2 className="text-5xl font-bold font-[family:var(--font-heading)] text-foreground leading-none tracking-tight">
                    Label.
                </h2>

                <p className="text-sm text-[var(--muted)] mt-3">
                    Define your organization’s existence. Know what you are.
                </p>
            </div>

            <form className="flex flex-col gap-6">

                {/* Organization Name */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgName">
                        Organization Name
                    </Label>
                    <Input
                        id="orgName"
                        type="text"
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                {/* Workspace URL / Slug */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgSlug">
                        Organization URL
                    </Label>
                    <div className="flex rounded-[var(--radius)] overflow-hidden border border-input shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
                        <div className="bg-slate-50 border-r border-input px-3 py-2 flex items-center justify-center text-sm text-[var(--muted)] select-none">
                            salina.com/
                        </div>
                        <input
                            id="orgSlug"
                            type="text"
                            placeholder="acme"
                            className="flex-1 bg-background px-3 py-2 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Organization Logo Upload Placeholder */}
                <div className="flex flex-col gap-2">
                    <Label>
                        Organization Logo
                    </Label>
                    {/* Replaced floating scale effect with static shadow-based depth for better click affordance */}
                    <div className="border border-input rounded-[var(--radius)] p-8 flex flex-col items-center justify-center text-center gap-2 bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-slate-100 border border-border rounded-full flex items-center justify-center text-[var(--muted)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div className="text-sm mt-2">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-[var(--muted)]">SVG, PNG, or JPG (max. 2MB)</p>
                    </div>
                </div>

            </form>
        </div>
    );
}