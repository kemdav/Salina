import React from "react";

export type UserRole =
  | "SuperAdmin"
  | "Admin"
  | "Officer"
  | "Member"
  | "Adviser";

export type VisibilityRole =
  | "Owner"
  | "Admin"
  | "Officer"
  | "Member"
  | "Viewer";

export type RouteSlug =
  | "dashboard"
  | "feed"
  | "members"
  | "attendance"
  | "recruitment"
  | "events"
  | "applications"
  | "id"
  | "roles"
  | "settings"
  | "accreditations"
  | "advisers"
  | "documents";

export interface NavRoute {
  label: string;
  href: string;
  icon: React.ReactNode;
  visibleTo: VisibilityRole[];
}

export interface SidebarRouteOptions {
  temporaryApplicant?: boolean;
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

const NAV_ITEM_DEFINITIONS: Array<{
  label: string;
  slug: RouteSlug;
  visibleTo: VisibilityRole[];
  icon: React.ReactNode;
}> = [
  {
    label: "Dashboard",
    slug: "dashboard",
    visibleTo: ["Owner", "Admin", "Member", "Viewer"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Feed",
    slug: "feed",
    visibleTo: ["Owner", "Admin", "Member", "Viewer"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h6m-6 4h8M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V7a2 2 0 012-2z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Applications",
    slug: "applications",
    visibleTo: ["Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3h6l4 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4"
        />
      </IconWrapper>
    ),
  },
  {
    label: "ID",
    slug: "id",
    visibleTo: ["Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 11h3m-3 4h8M9.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Members",
    slug: "members",
    visibleTo: ["Owner", "Admin", "Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Attendance",
    slug: "attendance",
    visibleTo: ["Admin", "Officer", "Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-5l2 2 4-4"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Recruitment",
    slug: "recruitment",
    visibleTo: ["Owner", "Admin", "Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Events",
    slug: "events",
    visibleTo: ["Owner", "Admin", "Member", "Viewer"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Roles",
    slug: "roles",
    visibleTo: ["Owner", "Admin"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Settings",
    slug: "settings",
    visibleTo: ["Owner", "Admin", "Officer", "Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </IconWrapper>
    ),
  },

  {
    label: "Accreditations",
    slug: "accreditations",
    visibleTo: ["Owner"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Advisers",
    slug: "advisers",
    visibleTo: ["Owner"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </IconWrapper>
    ),
  },
  {
    label: "Documents",
    slug: "documents",
    visibleTo: ["Owner", "Admin", "Officer", "Member"],
    icon: (
      <IconWrapper>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </IconWrapper>
    ),
  },
];

const ROLE_ROUTE_SLUGS: Record<UserRole, RouteSlug[]> = {
  SuperAdmin: [
    "dashboard",
    "members",
    "accreditations",
    "advisers",
    "settings",
  ],
  Adviser: ["dashboard", "members", "accreditations", "advisers"],
  Admin: [
    "dashboard",
    "feed",
    "members",
    "recruitment",
    "events",
    "attendance",
    "roles",
    "settings",
    "documents",
  ],
  Officer: ["dashboard", "feed", "members", "documents"],
  Member: [
    "dashboard",
    "feed",
    "members",
    "applications",
    "events",
    "id",
    "settings",
    "documents",
  ],
};

function getRolePath(role: UserRole) {
  return role.toLowerCase();
}

function buildRoutesForRole(role: UserRole) {
  const allowedSlugs = ROLE_ROUTE_SLUGS[role];

  return allowedSlugs
    .map((slug) => NAV_ITEM_DEFINITIONS.find((item) => item.slug === slug))
    .filter((item): item is (typeof NAV_ITEM_DEFINITIONS)[number] =>
      Boolean(item),
    )
    .map<NavRoute>((item) => {
      const isOrganizationsTab =
        (role === "SuperAdmin" || role === "Adviser") &&
        item.slug === "members";

      return {
        label: isOrganizationsTab ? "Organizations" : item.label,
        href: `/${getRolePath(role)}/${isOrganizationsTab ? "organizations" : item.slug}`,
        icon: item.icon,
        visibleTo: item.visibleTo,
      };
    });
}

export const ROLE_ROUTES: Record<UserRole, NavRoute[]> = {
  SuperAdmin: buildRoutesForRole("SuperAdmin"),
  Adviser: buildRoutesForRole("Adviser"),
  Admin: buildRoutesForRole("Admin"),
  Officer: buildRoutesForRole("Officer"),
  Member: buildRoutesForRole("Member"),
};

export function getSidebarRoutes(
  role: UserRole,
  options: SidebarRouteOptions = {},
) {
  const routes = ROLE_ROUTES[role];

  if (role === "Member" && options.temporaryApplicant) {
    return routes.filter((route) => route.href.endsWith("/applications"));
  }

  return routes;
}
