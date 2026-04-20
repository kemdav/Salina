'use client';

import { Label } from "@/components/atoms/label";

interface ColorPickerProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function ColorPicker({ id, label, value, onChange }: ColorPickerProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center gap-3">
                {/* Visual Swatch */}
                <input
                    type="color"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-[46px] w-[46px] shrink-0 cursor-pointer rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-white p-1"
                />
                {/* Hex Text Input */}
                <input
                    type="text"
                    value={value.toUpperCase()}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex h-[46px] flex-1 rounded-[var(--radius)] border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
            </div>
        </div>
    );
}