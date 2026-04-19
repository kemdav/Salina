'use client';

import { useState } from "react";
import { FieldMessage } from "@/components/atoms/field-message";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";

const ORG_TYPES = [
    "Business / Corporation",
    "Non-Profit Organization",
    "Association / Society",
    "Academic Institution",
    "Government Agency",
    "Other",
] as const;

export interface OrganizationSetupState {
    name: string;
    slug: string;
    billingEmail: string;
    organizationType: string;
    parentAffiliation: string;
}

export type OrganizationSetupField = keyof OrganizationSetupState;

export type OrganizationSetupErrors = Partial<Record<OrganizationSetupField, string>>;

interface OrgSpaceSetupFormProps {
    errors?: OrganizationSetupErrors;
    value: OrganizationSetupState;
    onChange: <K extends OrganizationSetupField>(field: K, value: OrganizationSetupState[K]) => void;
}

function toSlug(value: string) {
    return value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-");
}

export function OrgSpaceSetupForm({ errors, value, onChange }: OrgSpaceSetupFormProps) {

    const [logoFileName, setLogoFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = <K extends OrganizationSetupField>(field: K, nextValue: OrganizationSetupState[K]) => {
        onChange(field, nextValue);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLogoFileName(e.target.files[0].name);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setLogoFileName(e.dataTransfer.files[0].name);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h1 className="text-sm font-light uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
                    ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">ORGANIZATION DETAILS</span>
                </h1>

                <h2 className="text-5xl font-bold text-foreground leading-none tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    Label.
                </h2>

                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                    Define your organization’s existence. Know what you are.
                </p>
            </div>

            <div className="flex flex-col gap-6">

                {/* Organization Name */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgName">
                        Organization Name
                    </Label>
                    <Input
                        id="orgName"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={value.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors?.name}
                    />
                    {errors?.name ? (
                        <FieldMessage role="alert" variant="error">{errors.name}</FieldMessage>
                    ) : null}
                </div>
                {/* Organization Type */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgType">
                        Organization Type
                    </Label>
                    <Select
                        id="orgType"
                        value={value.organizationType}
                        onChange={(e) => handleChange("organizationType", e.target.value)}
                        error={!!errors?.organizationType}
                    >
                        <option value="" disabled>Select an organization type</option>
                        {ORG_TYPES.map((organizationType) => (
                            <option key={organizationType} value={organizationType}>
                                {organizationType}
                            </option>
                        ))}
                    </Select>
                    {errors?.organizationType ? (
                        <FieldMessage role="alert" variant="error">{errors.organizationType}</FieldMessage>
                    ) : null}
                </div>

                {/* Parent Affiliation */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="parentAffiliation">
                        Parent Affiliation <span className="ml-1 font-normal" style={{ color: "var(--muted)" }}>(Optional)</span>
                    </Label>
                    <Input
                        id="parentAffiliation"
                        type="text"
                        placeholder="e.g. Cebu Institute of Technology - University"
                        value={value.parentAffiliation}
                        onChange={(e) => handleChange("parentAffiliation", e.target.value)}
                    />
                </div>

                {/* Billing Email */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="billingEmail">
                        Billing Email
                    </Label>
                    <Input
                        id="billingEmail"
                        type="email"
                        placeholder="billing@organization.com"
                        value={value.billingEmail}
                        onChange={(e) => handleChange("billingEmail", e.target.value)}
                        error={!!errors?.billingEmail}
                    />
                    {errors?.billingEmail ? (
                        <FieldMessage role="alert" variant="error">{errors.billingEmail}</FieldMessage>
                    ) : (
                        <FieldMessage variant="helper">Used for provisioning and future billing notices.</FieldMessage>
                    )}
                </div>

                {/* Workspace URL / Slug */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="orgSlug">
                        Organization URL
                    </Label>
                    <div
                        className="flex overflow-hidden border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] transition duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10"
                        style={{ borderRadius: "var(--radius)" }}
                    >
                        <div className="border-r border-[#E5E7EB] px-3.5 flex items-center justify-center text-sm select-none" style={{ color: "var(--muted)" }}>
                            salina.com/
                        </div>
                        <input
                            id="orgSlug"
                            type="text"
                            placeholder="acme"
                            value={value.slug}
                            onChange={(e) => handleChange("slug", toSlug(e.target.value))}
                            className="flex flex-1 bg-transparent px-3.5 text-sm text-foreground outline-none placeholder:text-slate-400"
                            style={{ height: 46 }}
                        />
                    </div>
                    {errors?.slug ? (
                        <FieldMessage role="alert" variant="error">{errors.slug}</FieldMessage>
                    ) : (
                        <FieldMessage variant="helper">Subdomain: <strong>{value.slug || "your-slug"}</strong></FieldMessage>
                    )}
                </div>

                {/* Organization Logo Upload */}
                <div className="flex flex-col gap-2">
                    <Label>
                        Organization Logo
                    </Label>

                    <input
                        type="file"
                        id="logo-upload"
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <label
                        htmlFor="logo-upload"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-[1.5px] border-dashed p-8 flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 cursor-pointer ${isDragging
                            ? 'border-primary bg-primary/5 scale-[1.01]'
                            : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        style={{ borderRadius: "var(--radius)" }}
                    >
                        {/* The icon circle changes color when dragging too! */}
                        <div
                            className={`w-12 h-12 border shadow-sm rounded-full flex items-center justify-center overflow-hidden transition-colors ${isDragging ? 'bg-white border-primary text-primary' : 'bg-white border-[#E5E7EB]'
                                }`}
                            style={isDragging ? undefined : { color: "var(--muted)" }}
                        >
                            {logoFileName ? (
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            )}
                        </div>
                        <div className="text-sm mt-2 pointer-events-none">
                            {logoFileName ? (
                                <span className="font-semibold text-foreground">{logoFileName}</span>
                            ) : (
                                <><span className="font-semibold text-primary">Click to upload</span> or drag and drop</>
                            )}
                        </div>
                        <p className="text-xs pointer-events-none" style={{ color: "var(--muted)" }}>
                            {logoFileName ? "Logo prepared for staging" : "SVG, PNG, or JPG (max. 2MB)"}
                        </p>
                    </label>
                </div>

                {/* Info Reminder Banner */}
                <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <p className="text-pretty text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                        <span className="font-semibold text-foreground">Note:</span> Your organization name and slug will be visible to all users who interact with your curated content. The slug creates a unique vanity URL for your workspace.
                    </p>
                </div>

            </div>
        </div>
    );
}