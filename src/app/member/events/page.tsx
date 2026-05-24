import { getEvents } from "@/lib/actions/events";
import {
  resolveCurrentTenant,
  getCurrentViewer,
  createSupabaseUserClient,
} from "@/lib/supabase/server";
import { MemberEventsManager } from "@/components/organisms/member-events-manager";
import { notFound } from "next/navigation";

export default async function MemberEventsPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();
  const userClient = await createSupabaseUserClient();

  if (!tenant || !viewer || !userClient) {
    notFound();
  }

  const events = await getEvents();

  // Fetch my membership
  const { data: membership } = await userClient
    .from("organization_memberships")
    .select("id")
    .eq("tenant_id", tenant.id)
    .eq("user_id", viewer.id)
    .single();

  let initialAttendance: { event_id: string; status: string }[] = [];
  if (membership) {
    const { data: att } = await userClient
      .from("event_attendees")
      .select("event_id, status")
      .eq("member_id", membership.id);
    if (att) initialAttendance = att;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <MemberEventsManager
        events={events}
        initialAttendance={initialAttendance}
        memberId={membership?.id || ""}
      />
    </div>
  );
}
