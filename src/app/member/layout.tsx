import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { TemporaryApplicantRouteGuard } from "@/components/providers/temporary-applicant-route-guard";
import { TemporaryApplicantProvider } from "@/components/providers/temporary-applicant-provider";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";
import { getSwitchableRoles, isRoleAtLeast } from "@/lib/roles";
import type { UserRole } from "@/lib/navigation-config";

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

  const status = tenantContext.tenant?.status;
  if (status === "pending") {
    redirect("/pending");
  } else if (status === "suspended") {
    redirect("/suspended");
  } else if (status === "rejected") {
    redirect("/rejected");
  } else if (status === "inactive") {
    redirect("/inactive");
  }

  // Enforce role gate: only member, viewer, and higher roles can access /member/*
  // Temporary applicants can access /member/* (they are guarded client-side to only access /member/applications).
  // Officers and above can preview member content (permeable upward).
  // Users without a recognized role are redirected to login.
  if (
    !viewer.isPlatformAdmin &&
    !viewer.isTemporaryApplicant &&
    !isRoleAtLeast(viewer.tenantRole, "viewer")
  ) {
    redirect("/login");
  }

  // Compute switchable roles from the viewer's actual DB role.
  // Admin/Officer accessing member pages will see their higher-role chips to switch back.
  const switchableRoles: UserRole[] = getSwitchableRoles(
    viewer.tenantRole,
    "Member",
  );

  return (
    <TemporaryApplicantProvider value={viewer.isTemporaryApplicant ?? false}>
      <TemporaryApplicantRouteGuard />
      <AuthenticatedShell
        role="Member"
        viewableRoles={switchableRoles}
        tenantBranding={
          tenantContext.tenant
            ? {
                name: tenantContext.tenant.name,
                primaryColor:
                  tenantContext.tenant.themeConfig.primaryColor ?? "#c6623e",
                textColor: "#ffffff",
                logoUrl: tenantContext.tenant.themeConfig.logoUrl ?? undefined,
                fontFamily:
                  tenantContext.tenant.themeConfig.fontFamily ?? undefined,
              }
            : undefined
        }
        userName={viewer.displayName ?? viewer.email?.split("@")[0] ?? "Member"}
        customPermissions={viewer.customPermissions}
        userId={viewer.id}
        tenantId={viewer.tenantId}
      >
        {children}
      </AuthenticatedShell>
    </TemporaryApplicantProvider>
  );
}
