import { resolveCurrentTenant } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatusPageTemplate } from "@/components/templates/status-page";

export default async function InactivePage() {
  const { tenant } = await resolveCurrentTenant();

  if (tenant?.status !== "inactive") {
    redirect("/");
  }

  return (
    <StatusPageTemplate
      title="Account Inactive"
      tenantName={tenant?.name}
      description="The account for {tenantName} is currently inactive."
      supportMessage="If you are the owner, please contact support to reactivate your workspace."
      variant="muted"
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
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      }
    />
  );
}
