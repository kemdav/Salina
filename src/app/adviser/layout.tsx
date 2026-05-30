import { type ReactNode } from "react";
import { getCurrentViewer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";

export default async function AdviserLayout({ children }: { children: ReactNode }) {
  const viewer = await getCurrentViewer();
  if (!viewer) redirect("/login");

  const adminClient = createSupabaseAdminClient("adviser-portal");
  if (!adminClient) throw new Error("Server error");

  const { data: adviser } = await adminClient
    .from("advisers")
    .select("*")
    .eq("user_id", viewer.id)
    .single();

  if (!adviser) redirect("/onboarding");

  // If not approved, they shouldn't see the navigation tabs, just the content
  if (adviser.status !== "approved") {
    return (
      <div className="min-h-screen bg-stone-50">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <AuthenticatedShell
      role="Adviser"
      userName={adviser.name}
      userId={viewer.id}
      tenantId={viewer.tenantId}
    >
      {children}
    </AuthenticatedShell>
  );
}
