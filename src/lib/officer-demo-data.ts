import type { AuthenticatedTenantBranding } from "@/components/molecules/authenticated-top-bar";
import { CalendarEvent } from "@/components/molecules/calendar-day";

export const OFFICER_TENANT_BRANDING = {
  name: "Cebu Institute of Technology - University",
  primaryColor: "#c6623e",
  textColor: "#ffffff",
} satisfies AuthenticatedTenantBranding;

export const upcomingEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Jujutsu Workshop Series",
    // Make sure this date is in whatever month you are currently at the calednar
    date: "2026-05-14",
    day: 14,
    month: "MAY",
    time: "8:00 AM - 5:00 PM",
    location: "CPE Labs",
    type: "Workshop",
    status: "Registration Open",
    description:
      "Hands-on workshop covering basic exorcism techniques, cursed energy control, and jujutsu theory.",
  },
  {
    id: 2,
    title: "Region 7 CpE Challenge & Congress",
    date: "2026-05-22",
    day: 22,
    month: "MAY",
    time: "8:00 AM - 6:00 PM",
    location: "Main Campus Auditorium",
    type: "Competition",
    status: "Mandatory",
    description:
      "Annual regional hardware and software design competition. All officers and active members are expected to assist.",
  },
];
