'use client';

import { Label } from "@/components/atoms/label";

interface FontPickerProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function FontPicker({ id, label, value, onChange }: FontPickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex h-[46px] w-full appearance-none rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 pr-10 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                >
                    <option value="var(--font-body), sans-serif">System Default (Inter)</option>
                    <option value="Arial, sans-serif">Arial (Sans-Serif)</option>
                    <option value="'Helvetica Neue', sans-serif">Helvetica (Sans-Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="'Courier New', monospace">Courier (Monospace)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}