'use client';

import { useEffect, useState } from "react";
import { ColorPicker } from "@/components/molecules/color-picker";
import { FontPicker } from "@/components/molecules/font-picker";
import { ThemePresetCard } from "@/components/molecules/theme-preset-card";

{/* Theme Presets */ }
const PRESETS = [
    {
        name: 'Modern',
        colors: { primary: '#c6623e', accent: '#8a6ed4', secondary: '#fbf5f2', background: '#ffffff', text: '#1E293B' },
        fonts: { heading: 'var(--font-heading), sans-serif', title: 'var(--font-heading), sans-serif', body: 'var(--font-body), sans-serif' }
    },
    {
        name: 'Nature',
        colors: { primary: '#166534', accent: '#22c55e', secondary: '#f0fdf4', background: '#ffffff', text: '#14532d' },
        fonts: { heading: 'Georgia, serif', title: 'Georgia, serif', body: 'var(--font-body), sans-serif' }
    },
    {
        name: 'Midnight',
        colors: { primary: '#3b82f6', accent: '#8b5cf6', secondary: '#334155', background: '#0f172a', text: '#f8fafc' },
        fonts: { heading: "'Courier New', Courier, monospace", title: "var(--font-heading), sans-serif", body: "'Courier New', Courier, monospace" }
    },
    {
        name: 'Sunset',
        colors: { primary: '#7c2d12', accent: '#f97316', secondary: '#ffedd5', background: '#fffcf7', text: '#431407' },
        fonts: { heading: "'Trebuchet MS', sans-serif", title: "'Trebuchet MS', sans-serif", body: "var(--font-body), sans-serif" }
    }
];

export interface BrandingThemeConfig {
    primaryColor: string;
    fontFamily: string;
}

interface BrandingSetupFormProps {
    onThemeConfigChange?: (themeConfig: BrandingThemeConfig) => void;
}

export function BrandingSetupForm({ onThemeConfigChange }: BrandingSetupFormProps) {

    const [primaryColor, setPrimaryColor] = useState(PRESETS[0].colors.primary);
    const [accentColor, setAccentColor] = useState(PRESETS[0].colors.accent);
    const [secondaryColor, setSecondaryColor] = useState(PRESETS[0].colors.secondary);
    const [bgColor, setBgColor] = useState(PRESETS[0].colors.background); // NEW
    const [textColor, setTextColor] = useState(PRESETS[0].colors.text);

    const [headingFont, setHeadingFont] = useState(PRESETS[0].fonts.heading);
    const [titleFont, setTitleFont] = useState(PRESETS[0].fonts.title);
    const [bodyFont, setBodyFont] = useState(PRESETS[0].fonts.body);

    const [activePresetName, setActivePresetName] = useState<string | null>(PRESETS[0].name);

    useEffect(() => {
        onThemeConfigChange?.({
            primaryColor,
            fontFamily: headingFont,
        });
    }, [headingFont, onThemeConfigChange, primaryColor]);

    const handleApplyPreset = (preset: typeof PRESETS[0]) => {
        setPrimaryColor(preset.colors.primary);
        setAccentColor(preset.colors.accent);
        setSecondaryColor(preset.colors.secondary);
        setBgColor(preset.colors.background); // NEW
        setTextColor(preset.colors.text);

        setHeadingFont(preset.fonts.heading);
        setTitleFont(preset.fonts.title);
        setBodyFont(preset.fonts.body);

        onThemeConfigChange?.({
            primaryColor: preset.colors.primary,
            fontFamily: preset.fonts.heading,
        });

        setActivePresetName(preset.name);
    };

    const breakPreset = () => setActivePresetName(null);

    return (
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full items-start">

            {/* Left Column: Form Controls */}
            <div className="flex-1 flex flex-col w-full lg:max-w-md lg:max-h-180 overflow-y-auto overscroll-contain -ml-2 pl-2 pr-2 sm:pr-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-sm font-light text-(--muted) uppercase tracking-wide mb-2">
                            ONBOARDING &nbsp;/&nbsp; <span className="text-foreground font-medium">BRANDING CONFIGURATION</span>
                        </h1>
                        <h2
                            className="text-4xl sm:text-5xl font-bold text-foreground leading-none tracking-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Visual Language.
                        </h2>
                        <p className="text-sm text-(--muted) mt-3">
                            Define the visual identity. Show everyone who you are.
                        </p>
                    </div>

                    <div className="flex flex-col gap-10">
                        {/* Quick Presets Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold border-b border-border pb-2">Quick Presets</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {PRESETS.map((preset) => (
                                    <ThemePresetCard
                                        key={preset.name}
                                        preset={preset}
                                        isActive={activePresetName === preset.name}
                                        onClick={() => handleApplyPreset(preset)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Color Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold border-b border-border pb-2">Custom Colors</h3>
                            <ColorPicker id="color-primary" label="Primary Color" value={primaryColor} onChange={(v) => { setPrimaryColor(v); breakPreset(); }} />
                            <ColorPicker id="color-accent" label="Accent Color" value={accentColor} onChange={(v) => { setAccentColor(v); breakPreset(); }} />
                            <ColorPicker id="color-secondary" label="Secondary Borders" value={secondaryColor} onChange={(v) => { setSecondaryColor(v); breakPreset(); }} />
                            <ColorPicker id="color-bg" label="Background Color" value={bgColor} onChange={(v) => { setBgColor(v); breakPreset(); }} />
                        </div>

                        {/* Font Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold border-b border-border pb-2">Custom Typography</h3>
                            <FontPicker id="font-heading" label="Headings Font" value={headingFont} onChange={(v) => { setHeadingFont(v); breakPreset(); }} />
                            <FontPicker id="font-title" label="Titles Font" value={titleFont} onChange={(v) => { setTitleFont(v); breakPreset(); }} />
                            <FontPicker id="font-body" label="Body & Paragraph Font" value={bodyFont} onChange={(v) => { setBodyFont(v); breakPreset(); }} />

                            <div className="pt-2">
                                <ColorPicker id="color-text" label="Font Color" value={textColor} onChange={(v) => { setTextColor(v); breakPreset(); }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Live Preview Panel */}
            <div className="flex-1 flex flex-col w-full h-full">
                <div className="w-full h-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 flex flex-col shadow-inner">

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold text-(--muted) uppercase tracking-wider">Live Preview</span>
                        </div>
                    </div>

                    {/* THE MINI DASHBOARD CANVAS (Now uses bgColor!) */}
                    <div
                        className="w-full h-auto sm:h-70 rounded-xl shadow-sm flex flex-col sm:flex-row overflow-hidden transition-all duration-300"
                        style={{
                            border: `1px solid ${secondaryColor}`,
                            backgroundColor: bgColor, // Maps the physical background
                            "--preview-primary": primaryColor,
                            "--preview-accent": accentColor,
                            "--preview-secondary": secondaryColor,
                            "--preview-bg": bgColor,
                            "--preview-text": textColor,
                            "--preview-heading": headingFont,
                            "--preview-title": titleFont,
                            "--preview-body": bodyFont,
                        } as React.CSSProperties}
                    >
                        {/* Mini Sidebar / Mobile Top Nav */}
                        <div
                            className="w-full sm:w-1/3 p-3 sm:p-4 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-stretch gap-4 border-b sm:border-b-0 sm:border-r transition-colors duration-300"
                            style={{ borderColor: "var(--preview-secondary)", backgroundColor: "var(--preview-bg)" }}
                        >
                            <div className="flex items-center gap-2 mb-0 sm:mb-4">
                                <div className="w-6 h-6 shrink-0 rounded-md transition-colors duration-300" style={{ backgroundColor: "var(--preview-primary)" }} />
                                <div className="hidden sm:block h-3 w-16 rounded opacity-80 transition-colors duration-300" style={{ backgroundColor: "var(--preview-text)" }} />
                            </div>

                            <div className="flex flex-row sm:flex-col gap-2">
                                <div className="h-8 w-8 sm:w-full rounded-md flex items-center justify-center sm:justify-start sm:px-2 gap-2 transition-colors duration-300" style={{ backgroundColor: `${accentColor}20` }}>
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300" style={{ backgroundColor: "var(--preview-accent)" }} />
                                    <div className="hidden sm:block h-2 w-12 rounded transition-colors duration-300" style={{ backgroundColor: "var(--preview-accent)" }} />
                                </div>
                                <div className="h-8 w-8 sm:w-full rounded-md flex items-center justify-center sm:justify-start sm:px-2 gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                                    <div className="hidden sm:block h-2 w-16 rounded opacity-30 transition-colors duration-300" style={{ backgroundColor: "var(--preview-text)" }} />
                                </div>
                            </div>
                        </div>

                        {/* Mini Main Content Area */}
                        <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col relative transition-colors duration-300" style={{ backgroundColor: "var(--preview-bg)" }}>
                            <div className="flex justify-between items-start mb-4 sm:mb-6">
                                <div>
                                    <h4 className="text-lg sm:text-xl font-bold leading-none tracking-tight mb-1.5 sm:mb-2 transition-colors duration-300" style={{ color: "var(--preview-text)", fontFamily: "var(--preview-heading)" }}>
                                        Content Library
                                    </h4>
                                    <p className="text-[10px] sm:text-xs transition-colors duration-300" style={{ color: "var(--preview-text)", opacity: 0.6, fontFamily: "var(--preview-body)" }}>
                                        Manage your resources.
                                    </p>
                                </div>
                                <button type="button" className="px-3 py-1.5 text-[10px] sm:text-[11px] text-white rounded-md shadow-sm font-medium hover:opacity-90 transition-all duration-300 whitespace-nowrap" style={{ backgroundColor: "var(--preview-accent)", fontFamily: "var(--preview-title)" }}>
                                    + Add New
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 sm:gap-3 flex-1">
                                <div className="p-2.5 sm:p-3 rounded-lg flex items-center justify-between transition-colors duration-300" style={{ border: `1px solid var(--preview-secondary)`, backgroundColor: "var(--preview-bg)" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: "var(--preview-secondary)" }}>
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm transition-colors duration-300" style={{ backgroundColor: "var(--preview-primary)", opacity: 0.2 }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="h-2 w-16 sm:w-20 rounded transition-colors duration-300" style={{ backgroundColor: "var(--preview-text)" }} />
                                            <div className="h-1.5 w-10 sm:w-12 rounded opacity-40 transition-colors duration-300" style={{ backgroundColor: "var(--preview-text)" }} />
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] text-white font-medium tracking-wide transition-colors duration-300" style={{ backgroundColor: "var(--preview-primary)" }}>
                                        Edit
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TYPOGRAPHY PREVIEWER */}
                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#E5E7EB] flex flex-col gap-3 sm:gap-4">
                        <span className="text-[10px] sm:text-xs font-semibold text-(--muted) uppercase tracking-wider">
                            Typography & Color Preview
                        </span>

                        <div
                            className="p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-300 flex flex-col gap-2 sm:gap-3"
                            style={{
                                border: `1px solid ${secondaryColor}`,
                                backgroundColor: bgColor, // Applies background here too
                                color: textColor
                            }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight sm:leading-none transition-all duration-300" style={{ fontFamily: headingFont }}>
                                The quick brown fox.
                            </h2>
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight sm:leading-none transition-all duration-300" style={{ fontFamily: titleFont }}>
                                Jumps over the lazy dog.
                            </h3>
                            <p className="text-xs sm:text-sm leading-relaxed opacity-80 transition-all duration-300" style={{ fontFamily: bodyFont }}>
                                0123456789. Global typography will inherit these properties across all tenant interfaces.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}