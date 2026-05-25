import { resolveCurrentTenant } from "@/lib/supabase/server";

export default async function PendingPage() {
  const { tenant } = await resolveCurrentTenant();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stone-950 text-stone-50">
      <div className="w-full max-w-md rounded-2xl border border-warning/20 bg-warning/5 p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning/20">
          <svg
            className="h-8 w-8 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1
          className="mb-3 text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading, sans-serif)" }}
        >
          Under Review
        </h1>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          Your organization{" "}
          <strong className="font-semibold text-foreground">
            {tenant?.name}
          </strong>{" "}
          is currently pending accreditation approval.
        </p>
        <div className="rounded-xl bg-background/50 p-4 text-xs text-muted-foreground border border-border/50">
          We will send you an email notification as soon as a system
          administrator has reviewed your application.
        </div>
      </div>
    </div>
  );
}
