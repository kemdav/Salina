import { cn } from "@/lib/utils";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "green" | "yellow" | "red";
    children: React.ReactNode;
}

const BadgeIcon = ({ variant }: { variant: "green" | "yellow" | "red" }) => {
    if (variant === "green") {
        return (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2.47-7.53a.75.75 0 011.06 0 2.5 2.5 0 002.82 0 .75.75 0 11.88 1.194 4 4 0 01-4.76 0 .75.75 0 010-1.06zM8.25 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
            </svg>
        );
    }
    if (variant === "yellow") {
        return (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V9z" clipRule="evenodd" />
            </svg>
        );
    }
    return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm2.094-11.433a.75.75 0 00-1.188-.934L12 10.79l-.906-1.157a.75.75 0 00-1.188.934L10.96 12l-1.054 1.433a.75.75 0 101.188.934L12 13.21l.906 1.157a.75.75 0 001.188-.934L13.04 12l1.054-1.433z" clipRule="evenodd" />
        </svg>
    );
};

export function StatusBadge({ variant = "green", className, children, ...props }: StatusBadgeProps) {
    const baseStyles = "inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-colors";

    const variants = {
        green: "bg-[#e8f5ed] text-[#1aa46f]",
        yellow: "bg-[#fff1e5] text-[#f28b36]",
        red: "bg-[#fce9ed] text-[#df3654]"
    };

    return (
        <span
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            <BadgeIcon variant={variant} />
            {children}
        </span>
    );
}