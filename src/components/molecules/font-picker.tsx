"use client";

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
          style={{ fontFamily: value }}
          className="flex h-[46px] w-full appearance-none rounded-(--radius) border-[1.5px] border-[#E5E7EB] bg-[#F9FAFB] px-3.5 pr-10 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
        >
          {/* System / Sans-Serif */}
          <option
            style={{ fontFamily: "Inter, sans-serif" }}
            value="Inter, sans-serif"
          >
            System Default (Inter)
          </option>
          <option
            style={{ fontFamily: "Arial, sans-serif" }}
            value="Arial, sans-serif"
          >
            Arial
          </option>

          {/* Serif */}
          <option
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
            value="'Times New Roman', Times, serif"
          >
            Times New Roman
          </option>
          <option
            style={{ fontFamily: "Georgia, serif" }}
            value="Georgia, serif"
          >
            Georgia
          </option>

          {/* Monospace */}
          <option
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
            value="'Courier New', Courier, monospace"
          >
            Courier New
          </option>
          <option
            style={{ fontFamily: "'Lucida Console', Monaco, monospace" }}
            value="'Lucida Console', Monaco, monospace"
          >
            Lucida Console
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
