import { getEvents } from "@/lib/actions/events";
import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { canManageEvents } from "@/lib/organization-permissions";
import { EventsManager } from "@/components/organisms/events-manager";
import { notFound } from "next/navigation";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";

export default async function OfficerEventsPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!tenant || !viewer) {
    notFound();
  }

  const canManage = canManageEvents(viewer);

  if (!canManage) {
    // Only officers with relevant roles can access
    return (
      <AuthenticatedShell
        role="Officer"
        tenantBranding={{
          name: tenant.name,
          primaryColor: "#000",
          textColor: "#fff",
        }}
      >
        <div className="w-full max-w-6xl mx-auto py-8">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You do not have permission to manage events.</p>
        </div>
      </AuthenticatedShell>
    );
  }

  const events = await getEvents();

  return (
    <AuthenticatedShell
      role="Officer"
      tenantBranding={{
        name: tenant.name,
        primaryColor: "#000",
        textColor: "#fff",
      }}
    >
      <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        <EventsManager
          initialEvents={events}
          tenantSlug={tenant.slug}
          canManage={canManage}
        />
      </div>
    </AuthenticatedShell>
  );
}
