'use client';

import { useState } from "react";
import { ColorPicker } from "@/components/molecules/color-picker";
import { FontPicker } from "@/components/molecules/font-picker";

export function BrandingSetupForm() {

    // Theme State
    const [primaryColor, setPrimaryColor] = useState("#c6623e");
    const [accentColor, setAccentColor] = useState("#8a6ed4");
    const [secondaryColor, setSecondaryColor] = useState("#fbf5f2");

    const [textColor, setTextColor] = useState("#1E293B");

    const [headingFont, setHeadingFont] = useState("var(--font-heading), sans-serif");
    const [titleFont, setTitleFont] = useState("var(--font-heading), sans-serif");
    const [bodyFont, setBodyFont] = useState("var(--font-body), sans-serif");

    return (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">

            <div className="flex-1 flex flex-col gap-8 w-full lg:max-w-md">
                <div>
                    <h1 className="text-sm font-light text-[var(--muted)] uppercase tracking-wide mb-2">
                        ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">BRANDING CONFIGURATION</span>
                    </h1>
                    <h2 className="text-4xl sm:text-5xl font-bold font-[family:var(--font-heading)] text-foreground leading-none tracking-tight">
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
            <div className="flex-1 flex flex-col w-full">
                <div className="lg:sticky lg:top-28 w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 flex flex-col shadow-inner">

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Live Preview</span>
                        </div>
                    </div>

                    {/*PREVIEW DASHBOARD CANVAS */}
                    <div
                        className="w-full h-auto sm:h-[280px] bg-white rounded-xl shadow-sm flex flex-col sm:flex-row overflow-hidden transition-all duration-300"
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
                        <div
                            className="w-full sm:w-1/3 bg-[#F8FAFC] p-3 sm:p-4 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-stretch gap-4 border-b sm:border-b-0 sm:border-r"
                            style={{ borderColor: "var(--preview-secondary)" }}
                        >
                            {/* Logo Placeholder */}
                            <div className="flex items-center gap-2 mb-0 sm:mb-4">
                                <div className="w-6 h-6 shrink-0 rounded-md" style={{ backgroundColor: "var(--preview-primary)" }} />
                                <div className="hidden sm:block h-3 w-16 rounded opacity-80" style={{ backgroundColor: "var(--preview-text)" }} />
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-row sm:flex-col gap-2">
                                {/* Active Link */}
                                <div className="h-8 w-8 sm:w-full rounded-md flex items-center justify-center sm:justify-start sm:px-2 gap-2" style={{ backgroundColor: `${accentColor}15` }}>
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--preview-accent)" }} />
                                    <div className="hidden sm:block h-2 w-12 rounded" style={{ backgroundColor: "var(--preview-accent)" }} />
                                </div>
                                {/* Inactive Links */}
                                <div className="h-8 w-8 sm:w-full rounded-md flex items-center justify-center sm:justify-start sm:px-2 gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                                    <div className="hidden sm:block h-2 w-16 rounded opacity-30" style={{ backgroundColor: "var(--preview-text)" }} />
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col relative">
                            {/* Header row */}
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div>
                                    <h4
                                        className="text-lg sm:text-xl font-bold leading-none tracking-tight mb-1.5 sm:mb-2"
                                        style={{ color: "var(--preview-text)", fontFamily: "var(--preview-heading)" }}
                                    >
                                        Content Library
                                    </h4>
                                    <p
                                        className="text-[10px] sm:text-xs"
                                        style={{ color: "var(--preview-text)", opacity: 0.6, fontFamily: "var(--preview-body)" }}
                                    >
                                        Manage your resources.
                                    </p>
                                </div>

                                <button
                                    className="px-3 py-1.5 text-[10px] sm:text-[11px] text-white rounded-md shadow-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                                    style={{ backgroundColor: "var(--preview-accent)", fontFamily: "var(--preview-title)" }}
                                >
                                    + Add New
                                </button>
                            </div>

                            {/* Content Cards */}
                            <div className="flex flex-col gap-2 sm:gap-3 flex-1">
                                <div
                                    className="p-2.5 sm:p-3 rounded-lg flex items-center justify-between bg-white"
                                    style={{ border: `1px solid var(--preview-secondary)` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded bg-slate-100 flex items-center justify-center">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{ backgroundColor: "var(--preview-secondary)" }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="h-2 w-16 sm:w-20 rounded" style={{ backgroundColor: "var(--preview-text)" }} />
                                            <div className="h-1.5 w-10 sm:w-12 rounded opacity-40" style={{ backgroundColor: "var(--preview-text)" }} />
                                        </div>
                                    </div>
                                    <div
                                        className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] text-white font-medium tracking-wide"
                                        style={{ backgroundColor: "var(--preview-primary)" }}
                                    >
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TYPOGRAPHY PREVIEWER */}
                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E5E7EB] flex flex-col gap-3 sm:gap-4">
                        <span className="text-[10px] sm:text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                            Typography
                        </span>

                        <div
                            className="p-4 sm:p-6 bg-white rounded-xl shadow-sm transition-colors duration-300 flex flex-col gap-2 sm:gap-3"
                            style={{
                                border: `1px solid ${secondaryColor}`,
                                color: textColor
                            }}
                        >
                            <h3
                                className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight sm:leading-none"
                                style={{ fontFamily: headingFont }}
                            >
                                The quick brown fox.
                            </h3>
                            <p
                                className="text-2xl sm:text-2xl leading-relaxed opacity-80"
                                style={{ fontFamily: titleFont }}
                            >
                                Jumps over the lazy dog.
                            </p>
                            <p
                                className="text-xs sm:text-sm leading-relaxed opacity-80"
                                style={{ fontFamily: bodyFont }}
                            >
                                0123456789. Global typography will inherit these properties across all tenant interfaces.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}