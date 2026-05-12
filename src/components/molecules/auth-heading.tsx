import { cn } from "@/lib/utils";

interface AuthHeadingProps {
  align?: "center" | "left";
  description: string;
  eyebrow?: string;
  title: string;
}

export function AuthHeading({
  align = "left",
  description,
  eyebrow,
  title,
}: AuthHeadingProps) {
  return (
    <div className={cn("mb-8", align === "center" && "text-center")}>
      {eyebrow ? (
        <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-(--muted)">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[36px] font-bold leading-[1.15] tracking-[-0.5px] text-foreground [font-family:var(--font-heading)]">
        {title}
      </h1>
      <p
        className={cn(
          "mt-1.5 text-[15px] leading-[1.6] text-(--muted)",
          align === "center" && "mx-auto max-w-80"
        )}
      >
        {description}
      </p>
    </div>
  );
}
