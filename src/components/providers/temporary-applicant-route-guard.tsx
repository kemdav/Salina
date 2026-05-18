"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useTemporaryApplicant } from "@/components/providers/temporary-applicant-provider";

export function TemporaryApplicantRouteGuard() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isTemporaryApplicant = useTemporaryApplicant();

  useEffect(() => {
    if (!isTemporaryApplicant) {
      return;
    }

    if (pathname.startsWith("/member/applications")) {
      return;
    }

    router.replace("/member/applications");
  }, [isTemporaryApplicant, pathname, router]);

  return null;
}