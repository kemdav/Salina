"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { ComingSoon } from "@/components/organisms/coming-soon";
import { UserRole } from "@/lib/navigation-config";

export default function UniversalComingSoonPage() {
  // Grab the variables from the URL
  const params = useParams();
  const router = useRouter();

  // Extract the Role
  const rawRole = (params?.role as string) || "admin";

  // Extract the Page/View
  const slugArray = (params?.slug as string[]) || ["dashboard"];
  const rawView = slugArray[0] || "dashboard";

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  let formattedRole = capitalize(rawRole);
  if (formattedRole.toLowerCase() === "superadmin")
    formattedRole = "SuperAdmin";
  const viewTitle = rawView.split("-").map(capitalize).join(" ");

  useEffect(() => {
    if (formattedRole.toLowerCase() === "superadmin") {
      router.replace("/superadmin/dashboard");
    }
  }, [formattedRole, router]);

  if (formattedRole.toLowerCase() === "superadmin") {
    return null;
  }

  // Fallback tenant branding when no layout provides it
  const fallbackBranding = {
    name: "Salina",
    primaryColor: "var(--primary)",
    textColor: "#ffffff",
  };

  return (
    <AuthenticatedShell
      role={formattedRole as UserRole}
      tenantBranding={fallbackBranding}
      emptyState={<ComingSoon moduleName={viewTitle} />}
    ></AuthenticatedShell>
  );
}
