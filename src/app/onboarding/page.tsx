import { redirect } from "next/navigation";

import { OnboardingTemplate } from "@/components/templates/onboarding-template";
import { getCurrentViewer } from "@/lib/supabase/server";
import { getTenantAppUrl } from "@/lib/root-domain";
import { getUserPendingRequest } from "@/lib/actions/accreditation-requests";

export default async function OnboardingPage() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (viewer.isTemporaryApplicant && viewer.tenantSlug) {
    redirect(`${await getTenantAppUrl(viewer.tenantSlug)}/member/applications`);
  }

  if (viewer.tenantId && viewer.tenantSlug) {
    redirect(await getTenantAppUrl(viewer.tenantSlug));
  }

  const request = await getUserPendingRequest();
  if (request) {
    if (request.status === "rejected") {
      redirect("/rejected");
    }
    redirect("/pending");
  }

  return <OnboardingTemplate />;
}
