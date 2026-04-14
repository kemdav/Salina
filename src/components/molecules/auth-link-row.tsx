import Link from "next/link";

import { cn } from "@/lib/utils";

interface AuthLinkRowProps {
  align?: "center" | "left";
  className?: string;
  href: string;
  linkLabel: string;
  prefix: string;
}

export function AuthLinkRow({
  align = "center",
  className,
  href,
  linkLabel,
  prefix,
}: AuthLinkRowProps) {
  return (
    <p
      className={cn(
        "text-sm text-[var(--muted)]",
        align === "center" && "text-center",
        className
      )}
    >
      {prefix}{" "}
      <Link
        className="font-semibold text-primary transition duration-200 hover:underline"
        href={href}
      >
        {linkLabel}
      </Link>
    </p>
  );
}
