import type { ViewerContext } from "@/lib/supabase/server";

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