import { cn } from "@/lib/utils";

export interface CalendarEvent {
    id: number | string;
    title: string;
    date: string;
    day: number;
    month: string;
    time: string;
    location: string;
    type: string;
    status: string;
    description: string;
}

export type NewEventPayload = Omit<CalendarEvent, "id" | "day" | "month" | "status">;

export interface TenantBranding {
    name: string;
    primaryColor: string;
    textColor: string;
}

export interface TenantBranding {
    name: string;
    primaryColor: string;
    textColor: string;
}

interface CalendarDayCellProps {
    day: number;
    events: CalendarEvent[];
    tenant: TenantBranding;
    isToday: boolean;
    onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarDayCell({ day, events, tenant, isToday, onEventClick }: CalendarDayCellProps) {
    const hasEvent = events.length > 0;

    return (
        <div className={cn(
            "min-h-[100px] sm:min-h-[120px] border-b border-r border-slate-100 p-2 transition-colors relative",
            hasEvent ? "bg-white" : "bg-slate-50/30"
        )}>
            {/* Day Number */}
            <span className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1",
                isToday ? "bg-slate-900 text-white shadow-sm" : "text-slate-700"
            )}>
                {day}
            </span>

            {/* Event Pills Container */}
            <div className="space-y-1.5 mt-1">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => onEventClick && onEventClick(event)}
                        className="group relative text-[10px] leading-tight px-1.5 py-1 rounded border shadow-sm truncate cursor-pointer transition-opacity hover:opacity-80"
                        style={{
                            backgroundColor: `${tenant.primaryColor}15`,
                            color: tenant.primaryColor,
                            borderColor: `${tenant.primaryColor}30`
                        }}
                    >
                        <span className="font-bold">{event.time.split(' ')[0]}</span> {event.title}
                    </div>
                ))}
            </div>
        </div>
    );
}