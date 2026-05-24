"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UniversalComingSoonPage() {
  const params = useParams();
  const router = useRouter();

  const rawRole = (params?.role as string) || "admin";

  // Redirect all catch-all role routes to the proper role home path.
  // This prevents bypassing the role-gated layouts at /admin, /officer, /member, /superadmin.
  useEffect(() => {
    const role = rawRole.toLowerCase();

    switch (role) {
      case "superadmin":
        router.replace("/superadmin/dashboard");
        break;
      case "admin":
        router.replace("/admin/dashboard");
        break;
      case "officer":
        router.replace("/officer/dashboard");
        break;
      case "member":
        router.replace("/member/dashboard");
        break;
      default:
        router.replace("/login");
    }
  }, [rawRole, router]);

  return null;
}
