'use client';

import { useState } from "react";
import { ColorPicker } from "@/components/molecules/color-picker";
import { FontPicker } from "@/components/molecules/font-picker";

export function BrandingSetupForm() {

    const [primaryColor, setPrimaryColor] = useState("#c6623e");
    const [accentColor, setAccentColor] = useState("#8a6ed4");
    const [secondaryColor, setSecondaryColor] = useState("#fbf5f2");

    const [textColor, setTextColor] = useState("#1E293B");

    const [headingFont, setHeadingFont] = useState("var(--font-heading), sans-serif");
    const [titleFont, setTitleFont] = useState("var(--font-heading), sans-serif");
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
                        Visual Language.
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-3">
                        Define the visual identity. Show everyone who you are.
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

                        {/* Font Color Picker */}
                        <div className="pt-2">
                            <ColorPicker id="color-text" label="Font Color" value={textColor} onChange={setTextColor} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Preview Panel */}
            <div className="flex-1 flex flex-col">
                <div className="sticky top-28 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8 flex flex-col shadow-inner">

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Live Preview</span>
                        </div>
                    </div>

                    {/* THE MINI DASHBOARD CANVAS */}
                    <div
                        className="w-full h-[280px] bg-white rounded-xl shadow-sm flex overflow-hidden transition-all duration-300"
                        style={{
                            border: `1px solid ${secondaryColor}`,
                            "--preview-primary": primaryColor,
                            "--preview-accent": accentColor,
                            "--preview-secondary": secondaryColor,
                            "--preview-text": textColor,
                            "--preview-heading": headingFont,
                            "--preview-title": titleFont,
                            "--preview-body": bodyFont,
                        } as React.CSSProperties}
                    >
                        {/* Mini Sidebar */}
                        <div
                            className="w-1/3 bg-[#F8FAFC] p-4 flex flex-col gap-4"
                            style={{ borderRight: `1px solid var(--preview-secondary)` }}
                        >
                            {/* Logo Placeholder */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-md" style={{ backgroundColor: "var(--preview-primary)" }} />
                                <div className="h-3 w-16 rounded opacity-80" style={{ backgroundColor: "var(--preview-text)" }} />
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-col gap-2">
                                {/* Active Link */}
                                <div className="h-8 w-full rounded-md flex items-center px-2 gap-2" style={{ backgroundColor: `${accentColor}15` }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--preview-accent)" }} />
                                    <div className="h-2 w-12 rounded" style={{ backgroundColor: "var(--preview-accent)" }} />
                                </div>
                                {/* Inactive Links */}
                                <div className="h-8 w-full rounded-md flex items-center px-2 gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                                    <div className="h-2 w-16 rounded opacity-30" style={{ backgroundColor: "var(--preview-text)" }} />
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3 p-6 flex flex-col relative">
                            {/* Header row */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4
                                        className="text-xl font-bold leading-none tracking-tight mb-2"
                                        style={{ color: "var(--preview-text)", fontFamily: "var(--preview-heading)" }}
                                    >
                                        Content Library
                                    </h4>
                                    <p
                                        className="text-xs"
                                        style={{ color: "var(--preview-text)", opacity: 0.6, fontFamily: "var(--preview-body)" }}
                                    >
                                        Manage your resources.
                                    </p>
                                </div>

                                <button
                                    className="px-3 py-1.5 text-[11px] text-white rounded-md shadow-sm font-medium hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "var(--preview-accent)", fontFamily: "var(--preview-title)" }}
                                >
                                    + Add New
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 flex-1">
                                <div
                                    className="p-3 rounded-lg flex items-center justify-between bg-white"
                                    style={{ border: `1px solid var(--preview-secondary)` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "var(--preview-secondary)" }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="h-2 w-20 rounded" style={{ backgroundColor: "var(--preview-text)" }} />
                                            <div className="h-1.5 w-12 rounded opacity-40" style={{ backgroundColor: "var(--preview-text)" }} />
                                        </div>
                                    </div>
                                    <div
                                        className="px-2 py-0.5 rounded-full text-[9px] text-white font-medium tracking-wide"
                                        style={{ backgroundColor: "var(--preview-primary)" }}
                                    >
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TYPOGRAPHY PREVIEWER */}
                    <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-col gap-4">
                        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                            Typography & Color Preview
                        </span>

                        <div
                            className="p-6 bg-white rounded-xl shadow-sm transition-colors duration-300 flex flex-col gap-3"
                            style={{
                                border: `1px solid ${secondaryColor}`,
                                color: textColor // Directly applies your chosen Font Color
                            }}
                        >
                            <h3
                                className="text-3xl font-bold tracking-tight leading-none"
                                style={{ fontFamily: headingFont }}
                            >
                                The quick brown fox.
                            </h3>
                            <p
                                className="text-sm leading-relaxed opacity-80"
                                style={{ fontFamily: bodyFont }}
                            >
                                Jumps over the lazy dog. 0123456789. Global typography will inherit these properties across all tenant interfaces.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}