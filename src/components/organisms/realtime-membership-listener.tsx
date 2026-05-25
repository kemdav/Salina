"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  userId: string;
  tenantId: string;
}

export function RealtimeMembershipListener({ userId, tenantId }: Props) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel("membership-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "organization_memberships",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Immediately refresh the router to fetch the latest layout and roles
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, tenantId, router]);

  return null;
}
