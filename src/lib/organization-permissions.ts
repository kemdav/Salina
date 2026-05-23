import type { ViewerContext } from "@/lib/supabase/server";

export const AVAILABLE_PERMISSIONS = [
  "Dashboard access",
  "Member roster edits",
  "Recruitment reviews",
  "Event management",
  "Announcement posting",
  "Settings access",
] as const;

export type OrganizationPermission = typeof AVAILABLE_PERMISSIONS[number];

type TemporaryApplicantPermissionViewer = Pick<
  ViewerContext,
  "isPlatformAdmin" | "tenantRole"
>;

export function canManageTemporaryApplicants(
  viewer: TemporaryApplicantPermissionViewer | null | undefined
) {
  if (!viewer) {
    return false;
  }

  if (viewer.isPlatformAdmin) {
    return true;
  }

  return (
    viewer.tenantRole === "owner" ||
    viewer.tenantRole === "admin" ||
    viewer.tenantRole === "officer"
  );
}

export function canManageEvents(
  viewer: TemporaryApplicantPermissionViewer | null | undefined
) {
  if (!viewer) {
    return false;
  }

  if (viewer.isPlatformAdmin) {
    return true;
  }

  return (
    viewer.tenantRole === "owner" ||
    viewer.tenantRole === "admin" ||
    viewer.tenantRole === "officer"
  );
}