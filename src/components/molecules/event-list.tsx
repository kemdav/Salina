import { Badge } from "@/components/atoms/badge";
import {
  CalendarEvent,
  TenantBranding,
} from "@/components/molecules/calendar-day";

interface EventListProps {
  events: CalendarEvent[];
  tenant: TenantBranding;
  onEventClick: (event: CalendarEvent) => void;
  onDeleteEvent?: (id: string | number) => void;
  canManage?: boolean;
}

export function EventList({
  events,
  tenant,
  onEventClick,
  onDeleteEvent,
  canManage = false,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
        <p className="font-medium text-slate-500">No upcoming events found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full space-y-4 animate-in fade-in duration-300">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row"
        >
          <div className="shrink-0 flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {event.month}
            </span>
            <span className="mt-1 text-2xl font-black leading-none text-slate-800">
              {event.day}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">
                {event.title}
              </h3>
              <Badge
                className="border-transparent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-none"
                style={{
                  backgroundColor: `${tenant.primaryColor}15`,
                  color: tenant.primaryColor,
                }}
              >
                {event.type}
              </Badge>
            </div>
            <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {event.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {event.time}
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.location}
              </div>
            </div>
          </div>

          <div className="shrink-0 mt-2 flex items-center gap-2 border-t border-slate-100 pt-4 sm:mt-0 sm:justify-end sm:border-t-0 sm:border-l sm:pl-5 sm:pt-0">
            {canManage && onDeleteEvent ? (
              <button
                type="button"
                onClick={(eventClick) => {
                  eventClick.stopPropagation();
                  onDeleteEvent(event.id);
                }}
                className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
                title="Remove Event"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onEventClick(event)}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 sm:w-auto"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
