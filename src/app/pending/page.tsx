import { resolveCurrentTenant } from "@/lib/supabase/server";
import { getUserPendingRequest } from "@/lib/actions/accreditation-requests";
import { StatusPageTemplate } from "@/components/templates/status-page";
import { redirect } from "next/navigation";

export default async function PendingPage() {
  const { tenant } = await resolveCurrentTenant();

  if (tenant) {
    if (tenant.status !== "pending") {
      redirect("/");
    }

    return (
      <StatusPageTemplate
        title="Under Review"
        tenantName={tenant.name}
        description="Your organization {tenantName} is currently pending accreditation approval."
        supportMessage="We will send you an email notification as soon as a system administrator has reviewed your application."
        variant="warning"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    );
  }

  // Fallback for requests in the accreditation_requests table (root domain)
  const request = await getUserPendingRequest();

  if (request?.status === "pending") {
    return (
      <StatusPageTemplate
        title="Under Review"
        tenantName={request.org_name}
        description="Your organization {tenantName} is currently pending accreditation approval."
        supportMessage="We will send you an email notification as soon as a system administrator has reviewed your application."
        variant="warning"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    );
  }

  redirect("/login");
}
