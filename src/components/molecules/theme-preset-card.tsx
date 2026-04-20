'use client';

import { cn } from "@/lib/utils";

interface ThemePreset {
    name: string;
    colors: {
        primary: string;
        accent: string;
        secondary: string;
        background: string; // <-- Added background
        text: string;
    };
    fonts: {
        heading: string;
        title: string;
        body: string;
    };
}

interface ThemePresetCardProps {
    preset: ThemePreset;
    isActive: boolean;
    onClick: () => void;
}

export function ThemePresetCard({ preset, isActive, onClick }: ThemePresetCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex flex-col items-start gap-3 p-3 rounded-xl border-[1.5px] text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10",
                isActive ? "border-primary ring-1 ring-primary shadow-md scale-[1.02]" : "border-[#E5E7EB] hover:border-slate-300 hover:shadow-sm"
            )}
            style={{
                backgroundColor: preset.colors.background,
                color: preset.colors.text
            }}
        >
            <span className="text-sm font-semibold opacity-90">
                {preset.name}
            </span>

            {/* Color Swatch Row */}
            <div className="flex items-center gap-1.5 w-full">
                <div
                    className="h-6 w-6 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: preset.colors.primary }}
                    title="Primary"
                />
                <div
                    className="h-6 w-6 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: preset.colors.accent }}
                    title="Accent"
                />
                <div
                    className="h-6 flex-1 rounded-full shadow-inner border border-black/10"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title="Secondary"
                />
            </div>
        </button>
    );
}