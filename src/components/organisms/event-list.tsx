import { CalendarEvent, TenantBranding } from "@/components/molecules/calendar-day"; // Adjust path if needed
import { Badge } from "@/components/atoms/badge";

interface EventListProps {
    events: CalendarEvent[];
    tenant: TenantBranding;
    onEventClick: (event: CalendarEvent) => void;
}

export function EventList({ events, tenant, onEventClick }: EventListProps) {
    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-slate-500 font-medium">No upcoming events found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {events.map((event) => (
                <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="group flex flex-col sm:flex-row gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
                >
                    {/* Date Block */}
                    <div
                        className="flex flex-col items-center justify-center shrink-0 w-16 h-16 rounded-lg text-white shadow-sm"
                        style={{ backgroundColor: tenant.primaryColor }}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">{event.month}</span>
                        <span className="text-2xl font-black leading-none mt-0.5">{event.day}</span>
                    </div>

                    {/* Event Details */}
                    <div className="flex flex-col flex-1 justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-slate-600 transition-colors">
                                {event.title}
                            </h4>
                            {/* You can swap this for your new StatusBadge if you prefer! */}
                            <Badge className="bg-slate-100 text-slate-600 border-transparent shadow-none hover:bg-slate-200 font-semibold">
                                {event.type}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {event.location}
                            </span>
                        </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="flex items-center justify-end sm:justify-center text-slate-300 group-hover:text-slate-800 transition-colors sm:pl-4">
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            ))}
        </div>
    );
}