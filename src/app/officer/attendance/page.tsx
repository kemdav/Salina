import { LiveAttendanceTracker } from "@/components/organisms/live-attendance-tracker";
import { getEvents } from "@/lib/actions/events";

export default async function OfficerAttendancePage() {
  const events = await getEvents();

  return <LiveAttendanceTracker events={events} />;
}
