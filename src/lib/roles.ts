import type { UserRole, VisibilityRole } from "@/lib/navigation-config";

/**
 * All valid organization membership roles, ordered from highest to lowest privilege.
 */
export const ROLE_HIERARCHY = [
  "system_admin",
  "owner",
  "admin",
  "officer",
  "member",
  "viewer",
] as const;

export type Role = (typeof ROLE_HIERARCHY)[number];

const ROLE_RANK: Record<string, number> = Object.fromEntries(
  ROLE_HIERARCHY.map((role, index) => [role, index]),
);

/**
 * Returns true when `userRole` is at least as privileged as `requiredRole`
 * according to the role hierarchy.
 */
export function isRoleAtLeast(
  userRole: string | null | undefined,
  requiredRole: Role,
): boolean {
  if (!userRole) {
    return false;
  }

  const userRank = ROLE_RANK[userRole];
  const requiredRank = ROLE_RANK[requiredRole];

  if (userRank === undefined || requiredRank === undefined) {
    return false;
  }

  return userRank <= requiredRank;
}

/**
 * Returns the list of UI roles the given tenant role is permitted to view,
 * excluding the role that matches the current route group.
 *
 * An admin (DB role "admin" / "owner" / "system_admin") can visit all three route groups.
 * An officer can visit officer and member.
 * Members can only visit member pages.
 */
export function getSwitchableRoles(
  tenantRole: string | null | undefined,
  currentRouteRole: UserRole,
): UserRole[] {
  if (!tenantRole) {
    return [];
  }

  // Determine which UI roles this viewer is allowed to visit.
  let allowedUiRoles: UserRole[];

  if (
    tenantRole === "system_admin" ||
    tenantRole === "owner" ||
    tenantRole === "admin"
  ) {
    allowedUiRoles = ["Admin", "Officer", "Member"];
  } else if (tenantRole === "officer") {
    allowedUiRoles = ["Officer", "Member"];
  } else if (tenantRole === "member" || tenantRole === "viewer") {
    allowedUiRoles = ["Member"];
  } else {
    return [];
  }

  // Return everything except the route group the user is currently viewing.
  return allowedUiRoles.filter((r) => r !== currentRouteRole);
}

/**
 * Returns the role-appropriate home/dashboard path (root-relative) for a given role.
 * Used for post-login redirects and unauthorized redirects from route-group layouts.
 */
export function getRoleHomePath(role: string | null | undefined): string {
  if (!role) {
    return "/login";
  }

  switch (role) {
    case "system_admin":
      return "/superadmin/dashboard";
    case "owner":
    case "admin":
      return "/admin/dashboard";
    case "officer":
      return "/officer/dashboard";
    case "member":
    case "viewer":
      return "/member/dashboard";
    default:
      return "/login";
  }
}

/**
 * Maps a DB membership role string to the UI VisibilityRole.
 */
export function toVisibilityRole(role: string | null | undefined): VisibilityRole {
  if (!role) {
    return "Viewer";
  }

  switch (role) {
    case "system_admin":
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "officer":
      return "Officer";
    case "member":
      return "Member";
    case "viewer":
    default:
      return "Viewer";
  }
}
