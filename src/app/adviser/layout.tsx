import { type ReactNode } from "react";
import Link from "next/link";
import { getCurrentViewer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tight">Adviser Portal</h1>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link 
                href="/adviser/accreditations" 
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Accreditations
              </Link>
              <Link 
                href="/adviser/directory" 
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Directory
              </Link>
            </nav>
          </div>
          <div className="text-sm font-medium text-stone-600">
            {adviser.name}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
