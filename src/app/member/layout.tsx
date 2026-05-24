import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { TemporaryApplicantRouteGuard } from "@/components/providers/temporary-applicant-route-guard";
import { TemporaryApplicantProvider } from "@/components/providers/temporary-applicant-provider";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import { isRoleAtLeast } from "@/lib/roles";

function isInvalidRefreshTokenError(error: unknown) {
  const message =
    typeof error === "string"
      ? error.toLowerCase()
      : error &&
          typeof error === "object" &&
          "message" in error &&
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

  const tenantContext = await resolveCurrentTenant();

  const canAccessTenant =
    viewer.isPlatformAdmin ||
    (tenantContext.tenant && viewer.tenantId === tenantContext.tenant.id);

  if (!canAccessTenant) {
    redirect("/login");
  }

  // Enforce role gate: only member, viewer, and higher roles can access /member/*
  // Officers and above can preview member content (permeable upward).
  // Users without a recognized role are redirected to login.
  if (!viewer.isPlatformAdmin && !isRoleAtLeast(viewer.tenantRole, "viewer")) {
    redirect("/login");
  }

  return (
    <TemporaryApplicantProvider value={viewer.isTemporaryApplicant ?? false}>
      <TemporaryApplicantRouteGuard />
      <AuthenticatedShell
        role="Member"
        tenantBranding={
          tenantContext.tenant
            ? {
                name: tenantContext.tenant.name,
                primaryColor:
                  tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
                textColor: "#ffffff",
                logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
              }
            : undefined
        }
        userName={viewer.email?.split("@")[0] ?? "Member"}
      >
        {children}
      </AuthenticatedShell>
    </TemporaryApplicantProvider>
  );
}
