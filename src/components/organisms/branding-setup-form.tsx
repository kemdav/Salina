'use client';

import { useState } from "react";
import { ColorPicker } from "@/components/molecules/color-picker";
import { FontPicker } from "@/components/molecules/font-picker";

export function BrandingSetupForm() {
    // 1. Manage Theme State
    const [primaryColor, setPrimaryColor] = useState("#0F172A");
    const [accentColor, setAccentColor] = useState("#3B82F6");
    const [secondaryColor, setSecondaryColor] = useState("#64748B");

    const [headingFont, setHeadingFont] = useState("var(--font-body), sans-serif");
    const [titleFont, setTitleFont] = useState("var(--font-body), sans-serif");
    const [bodyFont, setBodyFont] = useState("var(--font-body), sans-serif");

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

            {/* Left Column: Form Controls */}
            <div className="flex-1 flex flex-col gap-8 max-w-md">
                <div>
                    <h1 className="text-sm font-light text-[var(--muted)] uppercase tracking-wide mb-2">
                        ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">BRANDING CONFIGURATION</span>
                    </h1>
                    <h2 className="text-5xl font-bold font-[family:var(--font-heading)] text-foreground leading-none tracking-tight">
                        Theme.
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-3">
                        Set the organization visual identity. This will be applied across your workspace.
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Color Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-border pb-2">Brand Colors</h3>
                        <ColorPicker id="color-primary" label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
                        <ColorPicker id="color-accent" label="Accent Color" value={accentColor} onChange={setAccentColor} />
                        <ColorPicker id="color-secondary" label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
                    </div>

                    {/* Font Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-border pb-2 mt-4">Typography</h3>
                        <FontPicker id="font-heading" label="Headings Font" value={headingFont} onChange={setHeadingFont} />
                        <FontPicker id="font-title" label="Titles Font" value={titleFont} onChange={setTitleFont} />
                        <FontPicker id="font-body" label="Body & Paragraph Font" value={bodyFont} onChange={setBodyFont} />
                    </div>
                </div>
            </div>

            {/* Right Column: Live Preview Panel */}
            <div className="flex-1 flex flex-col">
                <div className="sticky top-28 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8 flex flex-col gap-6 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Live Preview</span>
                    </div>

                    {/* The Interactive Preview Canvas */}
                    <div
                        className="bg-white rounded-xl border border-border p-6 shadow-sm flex flex-col gap-4"
                        // We map the React state directly into inline CSS variables for the preview container
                        style={{
                            "--preview-primary": primaryColor,
                            "--preview-accent": accentColor,
                            "--preview-secondary": secondaryColor,
                            "--preview-heading": headingFont,
                            "--preview-title": titleFont,
                            "--preview-body": bodyFont,
                        } as React.CSSProperties}
                    >
                        {/* Heading */}
                        <h3 style={{ fontFamily: "var(--preview-heading)", color: "var(--preview-primary)" }} className="text-2xl font-bold">
                            Welcome to the Workspace
                        </h3>

                        {/* Body */}
                        <p style={{ fontFamily: "var(--preview-body)", color: "var(--preview-secondary)" }} className="text-sm leading-relaxed">
                            This is a live preview of how your curated content and dashboard will look. Adjust the colors and fonts on the left to see the changes instantly reflected here.
                        </p>

                        {/* Card/Title Element */}
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 mt-2">
                            <h4 style={{ fontFamily: "var(--preview-title)", color: "var(--preview-primary)" }} className="text-lg font-semibold mb-1">
                                Interactive Component
                            </h4>
                            <p style={{ fontFamily: "var(--preview-body)", color: "var(--preview-secondary)" }} className="text-xs mb-4">
                                Even the smallest details will inherit your custom configuration.
                            </p>

                            {/* Accent Button */}
                            <button
                                style={{ backgroundColor: "var(--preview-accent)", fontFamily: "var(--preview-title)" }}
                                className="px-4 py-2 text-white text-sm font-medium rounded-md shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                            >
                                Primary Action
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}