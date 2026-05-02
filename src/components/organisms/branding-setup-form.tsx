"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { ColorPicker } from "@/components/molecules/color-picker";
import { FontPicker } from "@/components/molecules/font-picker";
import { ThemePresetCard } from "@/components/molecules/theme-preset-card";

const PRESETS = [
  {
    name: "Modern",
    colors: {
      primary: "#c6623e",
      accent: "#8a6ed4",
      secondary: "#fbf5f2",
      background: "#ffffff",
      text: "#1E293B",
    },
    fonts: {
      heading: "var(--font-heading), sans-serif",
      title: "var(--font-heading), sans-serif",
      body: "var(--font-body), sans-serif",
    },
  },
  {
    name: "Nature",
    colors: {
      primary: "#166534",
      accent: "#22c55e",
      secondary: "#f0fdf4",
      background: "#ffffff",
      text: "#14532d",
    },
    fonts: {
      heading: "Georgia, serif",
      title: "Georgia, serif",
      body: "var(--font-body), sans-serif",
    },
  },
  {
    name: "Midnight",
    colors: {
      primary: "#3b82f6",
      accent: "#8b5cf6",
      secondary: "#334155",
      background: "#0f172a",
      text: "#f8fafc",
    },
    fonts: {
      heading: "'Courier New', Courier, monospace",
      title: "var(--font-heading), sans-serif",
      body: "'Courier New', Courier, monospace",
    },
  },
  {
    name: "Sunset",
    colors: {
      primary: "#7c2d12",
      accent: "#f97316",
      secondary: "#ffedd5",
      background: "#fffcf7",
      text: "#431407",
    },
    fonts: {
      heading: "'Trebuchet MS', sans-serif",
      title: "'Trebuchet MS', sans-serif",
      body: "var(--font-body), sans-serif",
    },
  },
];

export interface BrandingThemeConfig {
  primaryColor: string;
  fontFamily: string;
  logoUrl?: string;
}

interface BrandingSetupFormProps {
  initialThemeConfig?: Partial<BrandingThemeConfig>;
  onThemeConfigChange?: (themeConfig: BrandingThemeConfig) => void;
}

export function BrandingSetupForm({
  initialThemeConfig,
  onThemeConfigChange,
}: BrandingSetupFormProps) {
  const [primaryColor, setPrimaryColor] = useState(
    initialThemeConfig?.primaryColor ?? PRESETS[0].colors.primary,
  );
  const [accentColor, setAccentColor] = useState(PRESETS[0].colors.accent);
  const [secondaryColor, setSecondaryColor] = useState(
    PRESETS[0].colors.secondary,
  );
  const [bgColor, setBgColor] = useState(PRESETS[0].colors.background);
  const [textColor, setTextColor] = useState(PRESETS[0].colors.text);
  const [logoUrl, setLogoUrl] = useState(initialThemeConfig?.logoUrl ?? "");

  const [headingFont, setHeadingFont] = useState(
    initialThemeConfig?.fontFamily ?? PRESETS[0].fonts.heading,
  );
  const [titleFont, setTitleFont] = useState(PRESETS[0].fonts.title);
  const [bodyFont, setBodyFont] = useState(PRESETS[0].fonts.body);

  const [activePresetName, setActivePresetName] = useState<string | null>(
    PRESETS[0].name,
  );

  useEffect(() => {
    onThemeConfigChange?.({
      primaryColor,
      fontFamily: headingFont,
      logoUrl: logoUrl.trim() || undefined,
    });
  }, [headingFont, logoUrl, onThemeConfigChange, primaryColor]);

  const handleApplyPreset = (preset: (typeof PRESETS)[number]) => {
    setPrimaryColor(preset.colors.primary);
    setAccentColor(preset.colors.accent);
    setSecondaryColor(preset.colors.secondary);
    setBgColor(preset.colors.background);
    setTextColor(preset.colors.text);
    setHeadingFont(preset.fonts.heading);
    setTitleFont(preset.fonts.title);
    setBodyFont(preset.fonts.body);
    setActivePresetName(preset.name);
  };

  const breakPreset = () => setActivePresetName(null);

  const previewVars = {
    border: `1px solid ${secondaryColor}`,
    backgroundColor: bgColor,
    "--preview-primary": primaryColor,
    "--preview-accent": accentColor,
    "--preview-secondary": secondaryColor,
    "--preview-bg": bgColor,
    "--preview-text": textColor,
    "--preview-heading": headingFont,
    "--preview-title": titleFont,
    "--preview-body": bodyFont,
  } as CSSProperties;

  return (
    <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex w-full flex-col gap-8 lg:max-h-180 lg:max-w-md flex-1 overflow-y-auto overscroll-contain -ml-2 pl-2 pr-2 pb-4 sm:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 transition-colors">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="mb-2 text-sm font-light uppercase tracking-wide text-(--muted)">
              ONBOARDING &nbsp;/&nbsp;{" "}
              <span className="font-medium text-foreground">
                BRANDING CONFIGURATION
              </span>
            </h1>
            <h2
              className="text-4xl font-bold leading-none tracking-tight text-foreground sm:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Visual Language.
            </h2>
            <p className="mt-3 text-sm text-(--muted)">
              Define the visual identity. Show everyone who you are.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-border pb-2 text-lg font-semibold">
                Quick Presets
              </h3>
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

            <div className="flex flex-col gap-4">
              <h3 className="border-b border-border pb-2 text-lg font-semibold">
                Custom Colors
              </h3>
              <ColorPicker
                id="color-primary"
                label="Primary Color"
                value={primaryColor}
                onChange={(value) => {
                  setPrimaryColor(value);
                  breakPreset();
                }}
              />
              <ColorPicker
                id="color-accent"
                label="Accent Color"
                value={accentColor}
                onChange={(value) => {
                  setAccentColor(value);
                  breakPreset();
                }}
              />
              <ColorPicker
                id="color-secondary"
                label="Secondary Borders"
                value={secondaryColor}
                onChange={(value) => {
                  setSecondaryColor(value);
                  breakPreset();
                }}
              />
              <ColorPicker
                id="color-bg"
                label="Background Color"
                value={bgColor}
                onChange={(value) => {
                  setBgColor(value);
                  breakPreset();
                }}
              />
              <ColorPicker
                id="color-text"
                label="Font Color"
                value={textColor}
                onChange={(value) => {
                  setTextColor(value);
                  breakPreset();
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="border-b border-border pb-2 text-lg font-semibold">
                Brand Logo
              </h3>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="logo-url"
                  className="text-sm font-medium text-foreground normal-case tracking-normal"
                >
                  Logo URL
                </Label>
                <Input
                  id="logo-url"
                  placeholder="https://example.com/logo.svg"
                  value={logoUrl}
                  onChange={(event) => {
                    setLogoUrl(event.target.value);
                    breakPreset();
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="border-b border-border pb-2 text-lg font-semibold">
                Custom Typography
              </h3>
              <FontPicker
                id="font-heading"
                label="Headings Font"
                value={headingFont}
                onChange={(value) => {
                  setHeadingFont(value);
                  breakPreset();
                }}
              />
              <FontPicker
                id="font-title"
                label="Titles Font"
                value={titleFont}
                onChange={(value) => {
                  setTitleFont(value);
                  breakPreset();
                }}
              />
              <FontPicker
                id="font-body"
                label="Body & Paragraph Font"
                value={bodyFont}
                onChange={(value) => {
                  setBodyFont(value);
                  breakPreset();
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col h-full lg:min-h-150">
        <div className="flex h-full w-full flex-col rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 shadow-inner sm:p-8">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-(--muted)">
                Live Preview
              </span>
            </div>
          </div>

          <div
            className="flex h-auto w-full flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 sm:flex-row"
            style={previewVars}
          >
            <div
              className="flex w-full flex-row items-center justify-between gap-4 border-b border-r-0 p-3 transition-colors duration-300 sm:w-1/3 sm:flex-col sm:items-stretch sm:justify-start sm:border-b-0 sm:border-r sm:p-4"
              style={{
                borderColor: "var(--preview-secondary)",
                backgroundColor: "var(--preview-bg)",
              }}
            >
              <div className="mb-0 flex items-center gap-2 sm:mb-4">
                <div
                  className="h-6 w-6 shrink-0 rounded-md transition-colors duration-300"
                  style={{ backgroundColor: "var(--preview-primary)" }}
                />
                <div
                  className="hidden h-3 w-16 rounded opacity-80 transition-colors duration-300 sm:block"
                  style={{ backgroundColor: "var(--preview-text)" }}
                />
              </div>

              <div className="flex flex-row gap-2 sm:flex-col">
                <div
                  className="flex h-8 w-8 items-center justify-center gap-2 rounded-md transition-colors duration-300 sm:w-full sm:justify-start sm:px-2"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: "var(--preview-accent)" }}
                  />
                  <div
                    className="hidden h-2 w-12 rounded transition-colors duration-300 sm:block"
                    style={{ backgroundColor: "var(--preview-accent)" }}
                  />
                </div>
                <div className="flex h-8 w-8 items-center justify-center gap-2 rounded-md sm:w-full sm:justify-start sm:px-2">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-transparent" />
                  <div
                    className="hidden h-2 w-16 rounded opacity-30 transition-colors duration-300 sm:block"
                    style={{ backgroundColor: "var(--preview-text)" }}
                  />
                </div>
              </div>
            </div>

            <div
              className="relative flex w-full flex-col p-4 transition-colors duration-300 sm:w-2/3 sm:p-6"
              style={{ backgroundColor: "var(--preview-bg)" }}
            >
              <div className="mb-4 flex items-start justify-between sm:mb-6">
                <div>
                  <h4
                    className="mb-1.5 text-lg font-bold leading-none tracking-tight transition-colors duration-300 sm:mb-2 sm:text-xl"
                    style={{
                      color: "var(--preview-text)",
                      fontFamily: "var(--preview-heading)",
                    }}
                  >
                    Content Library
                  </h4>
                  <p
                    className="text-[10px] transition-colors duration-300 sm:text-xs"
                    style={{
                      color: "var(--preview-text)",
                      opacity: 0.6,
                      fontFamily: "var(--preview-body)",
                    }}
                  >
                    Manage your resources.
                  </p>
                </div>
                <button
                  type="button"
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-[10px] font-medium text-white shadow-sm transition-all duration-300 hover:opacity-90 sm:text-[11px]"
                  style={{
                    backgroundColor: "var(--preview-accent)",
                    fontFamily: "var(--preview-title)",
                  }}
                >
                  + Add New
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2 sm:gap-3">
                <div
                  className="flex items-center justify-between rounded-lg p-2.5 transition-colors duration-300 sm:p-3"
                  style={{
                    border: "1px solid var(--preview-secondary)",
                    backgroundColor: "var(--preview-bg)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors duration-300 sm:h-8 sm:w-8"
                      style={{ backgroundColor: "var(--preview-secondary)" }}
                    >
                      <div
                        className="h-3 w-3 rounded-sm transition-colors duration-300 sm:h-4 sm:w-4"
                        style={{
                          backgroundColor: "var(--preview-primary)",
                          opacity: 0.2,
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div
                        className="h-2 w-16 rounded transition-colors duration-300 sm:w-20"
                        style={{ backgroundColor: "var(--preview-text)" }}
                      />
                      <div
                        className="h-1.5 w-10 rounded opacity-40 transition-colors duration-300 sm:w-12"
                        style={{ backgroundColor: "var(--preview-text)" }}
                      />
                    </div>
                  </div>
                  <div
                    className="rounded-full px-2 py-0.5 text-[8px] font-medium tracking-wide text-white transition-colors duration-300 sm:text-[9px]"
                    style={{ backgroundColor: "var(--preview-primary)" }}
                  >
                    Edit
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-(--muted) sm:text-xs">
              Typography & Color Preview
            </span>

            <div
              className="flex flex-col gap-2 rounded-xl p-4 shadow-sm transition-all duration-300 sm:gap-3 sm:p-6"
              style={{
                border: `1px solid ${secondaryColor}`,
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              <h2
                className="text-2xl font-bold leading-tight tracking-tight transition-all duration-300 sm:text-3xl sm:leading-none"
                style={{ fontFamily: headingFont }}
              >
                The quick brown fox.
              </h2>
              <h3
                className="text-xl font-semibold leading-tight tracking-tight transition-all duration-300 sm:text-2xl sm:leading-none"
                style={{ fontFamily: titleFont }}
              >
                Jumps over the lazy dog.
              </h3>
              <p
                className="text-xs leading-relaxed opacity-80 transition-all duration-300 sm:text-sm"
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
