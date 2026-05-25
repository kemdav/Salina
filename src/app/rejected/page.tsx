import { resolveCurrentTenant } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatusPageTemplate } from "@/components/templates/status-page";

export default async function RejectedPage() {
  const { tenant } = await resolveCurrentTenant();

  if (tenant?.status !== "rejected") {
    redirect("/");
  }

  return (
    <StatusPageTemplate
      title="Accreditation Rejected"
      tenantName={tenant?.name}
      description="The accreditation application for {tenantName} has been rejected."
      supportMessage="Unfortunately, your organization does not meet the requirements at this time. Please contact support if you believe this was in error."
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}
