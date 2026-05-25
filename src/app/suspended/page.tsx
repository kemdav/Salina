import { resolveCurrentTenant } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatusPageTemplate } from "@/components/templates/status-page";

export default async function SuspendedPage() {
  const { tenant } = await resolveCurrentTenant();

  if (tenant?.status !== "suspended") {
    redirect("/");
  }

  return (
    <StatusPageTemplate
      title="Account Suspended"
      tenantName={tenant?.name}
      description="Your organization {tenantName} has been temporarily suspended."
      supportMessage="Please contact system administration for more details on how to resolve this issue and restore your access."
      variant="destructive"
      icon={
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
    />
  );
}
