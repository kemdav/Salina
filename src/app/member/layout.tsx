import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { TemporaryApplicantRouteGuard } from "@/components/providers/temporary-applicant-route-guard";
import { TemporaryApplicantProvider } from "@/components/providers/temporary-applicant-provider";
import { getCurrentViewer } from "@/lib/supabase/server";

function isInvalidRefreshTokenError(error: unknown) {
  const message =
    typeof error === "string"
      ? error.toLowerCase()
      : error && typeof error === "object" && "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ? (error as { message: string }).message.toLowerCase()
        : "";

  return (
    message.includes("invalid refresh token") ||
    message.includes("refresh token not found")
  );
}

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  let viewer = null;

  try {
    viewer = await getCurrentViewer();
  } catch (error) {
    if (!isInvalidRefreshTokenError(error)) {
      throw error;
    }
  }

  if (!viewer) {
    redirect("/login");
  }

  return (
    <TemporaryApplicantProvider value={viewer?.isTemporaryApplicant ?? false}>
      <TemporaryApplicantRouteGuard />
      {children}
    </TemporaryApplicantProvider>
  );
}