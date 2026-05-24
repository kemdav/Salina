import type { ViewerContext } from "@/lib/supabase/server";

export const AVAILABLE_PERMISSIONS = [
  "Dashboard access",
  "Member roster edits",
  "Recruitment reviews",
  "Event management",
  "Announcement posting",
  "Settings access",
  "Temporary role assignment",
] as const;

export type OrganizationPermission = typeof AVAILABLE_PERMISSIONS[number];

type TemporaryApplicantPermissionViewer = Pick<
  ViewerContext,
  "isPlatformAdmin" | "tenantRole" | "customPermissions"
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

  if (viewer.customPermissions.includes("Recruitment reviews")) {
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

  if (viewer.customPermissions.includes("Event management")) {
    return true;
  }

  return (
    viewer.tenantRole === "owner" ||
    viewer.tenantRole === "admin" ||
    viewer.tenantRole === "officer"
  );
}

export function canAssignTemporaryRoles(
  viewer: TemporaryApplicantPermissionViewer | null | undefined
) {
  if (!viewer) {
    return false;
  }

  if (viewer.isPlatformAdmin) {
    return true;
  }

  if (viewer.customPermissions.includes("Temporary role assignment")) {
    return true;
  }

  return (
    viewer.tenantRole === "owner" ||
    viewer.tenantRole === "admin"
  );
}