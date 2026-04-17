import Link from "next/link";

import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/security", label: "Security" },
  { href: "/status", label: "Status" },
];

interface AuthFooterProps {
  bordered?: boolean;
  className?: string;
}

export function AuthFooter({ bordered = false, className }: AuthFooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-8 py-5 text-[11px] text-[var(--muted)]",
        bordered && "border-t border-black/5",
        className
      )}
    >
      <span>Salina</span>
      <nav className="flex flex-wrap items-center">
        {FOOTER_LINKS.map(({ href, label }, index) => (
          <span className="flex items-center" key={label}>
            <Link
              className="px-2 transition duration-200 hover:text-slate-600"
              href={href}
            >
              {label}
            </Link>
            {index < FOOTER_LINKS.length - 1 ? (
              <span aria-hidden="true" className="text-[var(--muted)]">
                ·
              </span>
            ) : null}
          </span>
        ))}
      </nav>
    </footer>
  );
}
