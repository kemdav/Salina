'use client';

import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";

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

                {/* 2. Organization Type using the new Select Atom! */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgType">
                        Organization Type
                    </Label>
                    <Select id="orgType" defaultValue="">
                        <option value="" disabled>Select an organization type</option>
                        <option value="student_org">Student Organization</option>
                        <option value="professional_chapter">Professional Chapter</option>
                        <option value="academic_dept">Academic Department</option>
                        <option value="corporate">Corporate Entity</option>
                        <option value="other">Other</option>
                    </Select>
                </div>

                {/* Parent Affiliation */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="parentAffiliation">
                        Parent Affiliation <span className="text-[var(--muted)] font-normal ml-1">(Optional)</span>
                    </Label>
                    <Input
                        id="parentAffiliation"
                        type="text"
                        placeholder="e.g. Cebu Institute of Technology - University"
                    />
                </div>

                {/* Workspace URL / Slug */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgSlug">
                        Organization URL
                    </Label>
                    <div className="flex rounded-[var(--radius)] overflow-hidden border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] transition duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                        <div className="border-r border-[#E5E7EB] px-3.5 flex items-center justify-center text-sm text-[var(--muted)] select-none">
                            salina.com/
                        </div>
                        <input
                            id="orgSlug"
                            type="text"
                            placeholder="acme"
                            className="flex h-[46px] flex-1 bg-transparent px-3.5 text-sm text-foreground outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Organization Logo Upload Placeholder */}
                <div className="flex flex-col gap-2">
                    <Label>
                        Organization Logo
                    </Label>
                    <div className="border-[1.5px] border-dashed border-[#E5E7EB] rounded-[var(--radius)] p-8 flex flex-col items-center justify-center text-center gap-2 bg-[#F9FAFB] hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-white border border-[#E5E7EB] shadow-sm rounded-full flex items-center justify-center text-[var(--muted)]">
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

                {/* Info Reminder Banner */}
                <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <p className="text-[13px] leading-relaxed text-[var(--muted)] text-pretty">
                        <span className="font-semibold text-foreground">Note:</span> Your organization name and slug will be visible to all users who interact with your curated content. The slug creates a unique vanity URL for your workspace.
                    </p>
                </div>

            </form>
        </div>
    );
}