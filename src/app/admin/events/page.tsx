import { getEvents } from "@/lib/actions/events";
import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { canManageEvents } from "@/lib/organization-permissions";
import { EventsManager } from "@/components/organisms/events-manager";
import { notFound } from "next/navigation";

export default async function AdminEventsPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  
  if (!tenant || !viewer) {
    notFound();
  }

  const canManage = canManageEvents(viewer);
  const events = await getEvents();

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <EventsManager initialEvents={events} tenantSlug={tenant.slug} canManage={canManage} />
    </div>
  );
}
