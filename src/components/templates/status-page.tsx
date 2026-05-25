import type { ReactNode } from "react";

interface StatusPageTemplateProps {
  title: string;
  tenantName?: string;
  description: string;
  supportMessage: string;
  variant: "warning" | "destructive" | "muted";
  icon: ReactNode;
}

export function StatusPageTemplate({
  title,
  tenantName,
  description,
  supportMessage,
  variant,
  icon,
}: StatusPageTemplateProps) {
  const variantStyles = {
    warning: {
      border: "border-warning/20",
      bg: "bg-warning/5",
      iconBg: "bg-warning/20",
      iconColor: "text-warning",
    },
    destructive: {
      border: "border-destructive/20",
      bg: "bg-destructive/5",
      iconBg: "bg-destructive/20",
      iconColor: "text-destructive",
    },
    muted: {
      border: "border-muted/20",
      bg: "bg-muted/10",
      iconBg: "bg-muted/20",
      iconColor: "text-muted-foreground",
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stone-950 text-stone-50">
      <div
        className={`w-full max-w-md rounded-2xl border ${style.border} ${style.bg} p-8 text-center shadow-lg`}
      >
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${style.iconBg}`}
        >
          <div className={`h-8 w-8 ${style.iconColor}`}>{icon}</div>
        </div>
        <h1
          className="mb-3 text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading, sans-serif)" }}
        >
          {title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          {description.split("{tenantName}").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <strong className="font-semibold text-foreground">
                  {tenantName}
                </strong>
              )}
            </span>
          ))}
        </p>
        <div className="rounded-xl bg-background/50 p-4 text-xs text-muted-foreground border border-border/50">
          {supportMessage}
        </div>
      </div>
    </div>
  );
}
