import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { getCurrentViewer } from "@/lib/supabase/server";

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const viewer = await getCurrentViewer();

  if (!viewer?.isPlatformAdmin) {
    redirect("/login");
  }

<<<<<<< HEAD
    return (
        <AuthenticatedShell role="SuperAdmin" userName={viewer.displayName ?? viewer.email?.split('@')[0] ?? 'System Admin'}>
            {children}
        </AuthenticatedShell>
    );
}
=======
  return (
    <AuthenticatedShell
      role="SuperAdmin"
      userName={viewer.email?.split("@")[0] ?? "System Admin"}
      userId={viewer.id}
      tenantId={viewer.tenantId}
    >
      {children}
    </AuthenticatedShell>
  );
}
>>>>>>> origin
