import { getCurrentViewer } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function AdviserPage() {
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

  if (adviser.status === "approved") {
    redirect("/adviser/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl py-12 px-6">
      <h1 className="text-3xl font-bold text-slate-900">Adviser Portal</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 capitalize">
          Status: {adviser.status}
        </h2>
        <p className="mt-2 text-slate-600">
          {adviser.status === "pending" && "Your adviser application is currently pending final review by the platform administrators."}
          {adviser.status === "approved" && "Your account has been approved. The full adviser dashboard is coming soon!"}
          {adviser.status === "rejected" && "Your application to become an adviser has been rejected."}
        </p>
      </div>
    </div>
  );
}
