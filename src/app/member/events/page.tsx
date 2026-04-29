'use client';

import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { cn } from "@/lib/utils";
import { EventMonthGrid } from "@/components/organisms/event-month-grid";
import { EventDetailsModal } from "@/components/organisms/event-details-modal"; // 1. Import the modal!
import { CalendarEvent, TenantBranding } from "@/components/molecules/calendar-day";

// --- DUMMY DATA ---
const dummyTenant: TenantBranding = {
    name: "Cebu Institute of Technology - University",
    primaryColor: "#c6623e",
    textColor: "#ffffff"
};

const upcomingEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "Bytes & Boards: Introduction to Arduino Basics",
        date: "2026-03-14",
        day: 14,
        month: "MAR",
        time: "8:00 AM - 5:00 PM",
        location: "CPE Labs",
        type: "Workshop",
        status: "Registration Open",
        description: "A hands-on workshop covering basic Arduino programming, microcontroller integration, and physical computing basics for Senior High School students."
    },
    {
        id: 2,
        title: "Region 7 CpE Challenge & Congress",
        date: "2026-04-11",
        day: 11,
        month: "APR",
        time: "8:00 AM - 6:00 PM",
        location: "Main Campus Auditorium",
        type: "Competition",
        status: "Mandatory",
        description: "Annual regional hardware and software design competition. All officers and active members are expected to assist with event coordination and logistics."
    },
    {
        id: 3,
        title: "Capstone Data Gathering & Prototype Review",
        date: "2026-05-15",
        day: 15,
        month: "MAY",
        time: "1:00 PM - 4:00 PM",
        location: "Org Room",
        type: "Academic",
        status: "Upcoming",
        description: "Final block diagram and prototype design check to prepare for the upcoming oral defenses. Bring your hardware modules."
    }
];
// --- ORGANISM 1: THE LIST VIEW ---
function EventListView({ events, tenant, onEventClick }: { events: CalendarEvent[], tenant: TenantBranding, onEventClick: (event: CalendarEvent) => void }) {
    return (
        <div className="flex-1 w-full space-y-4 animate-in fade-in duration-300">
            {events.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
                    {/* keep inside identicall */}
                    <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{event.month}</span>
                        <span className="text-2xl font-black text-slate-800 leading-none mt-1">{event.day}</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${tenant.primaryColor}15`, color: tenant.primaryColor }}>
                                {event.type}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{event.time}</div>
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{event.location}</div>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-5 mt-2 sm:mt-0">
                        {/* 2. WIRE UP THE VIEW DETAILS BUTTON */}
                        <button
                            onClick={() => onEventClick(event)}
                            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- MASTER TEMPLATE / PAGE ---
export default function MemberCalendarPage() {
    const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

    // 3. STATE TO MANAGE THE MODAL
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 4. FUNCTION TO OPEN MODAL
    const openEventDetails = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>
            <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

                {/* Page Header & View Toggles ... (unchanged) ... */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">Event Calendar</h2>
                        <p className="text-sm text-slate-500 mt-1">Stay up to date with upcoming workshops, assemblies, and deadlines.</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setActiveView('list')} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeView === 'list' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>List View</button>
                        <button onClick={() => setActiveView('grid')} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeView === 'grid' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Month Grid</button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* DYNAMIC CONTENT AREA - Pass the click handler! */}
                    {activeView === 'list' ? (
                        <EventListView events={upcomingEvents} tenant={dummyTenant} onEventClick={openEventDetails} />
                    ) : (
                        <EventMonthGrid events={upcomingEvents} tenant={dummyTenant} onEventClick={openEventDetails} />
                    )}

                    {/* Right Sidebar ... (unchanged) ... */}
                    <div className="w-full lg:w-72 shrink-0 space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Filter Events</h3>
                            <div className="space-y-3">
                                {["Workshops", "Competitions", "General Assemblies"].map(filter => (
                                    <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{filter}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. MOUNT THE MODAL COMPONENT */}
            <EventDetailsModal
                event={selectedEvent}
                tenant={dummyTenant}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </AuthenticatedShell>
    );
}