'use client';

import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { cn } from "@/lib/utils";
import { EventMonthGrid } from "@/components/organisms/event-month-grid";
import { EventDetailsModal } from "@/components/organisms/event-details-modal";
import { EventFormModal } from "@/components/organisms/event-form-modal";
import { Button } from "@/components/atoms/button";
import { OFFICER_TENANT_BRANDING, upcomingEvents } from "@/lib/officer-demo-data";
import { CalendarEvent, NewEventPayload, TenantBranding } from "@/components/molecules/calendar-day";

function OfficerEventListView({
    events,
    tenant,
    onEventClick,
    onDeleteEvent,
    canManage
}: {
    events: CalendarEvent[],
    tenant: TenantBranding,
    onEventClick: (event: CalendarEvent) => void,
    onDeleteEvent: (id: string | number) => void,
    canManage: boolean
}) {
    return (
        <div className="flex-1 w-full space-y-4 animate-in fade-in duration-300">
            {events.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">

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
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{event.time}</div>
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{event.location}</div>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-5 mt-2 sm:mt-0">
                        {/* Remove Button (Only visible if Officer has powers) */}
                        {canManage && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteEvent(event.id);
                                }}
                                className="px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors"
                                title="Remove Event"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
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
export default function OfficerEventsPage() {
    const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

    // Modals State
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // This variable controls if THIS specific officer sees the Add/Remove buttons
    const hasEventCreationPowers = true;

    // Handlers
    const openEventDetails = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };

    const handleCreateEvent = (data: NewEventPayload) => {
        console.log("Creating new event:", data);
        alert(`Event Created: ${data.title}`);
    };

    const handleDeleteEvent = (id: string | number) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this event?");
        if (confirmDelete) {
            console.log("Deleted event ID:", id);
            alert("Event removed successfully.");
        }
    };

    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

                {/* Page Header & View Toggles */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Event Management</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage the calendar, schedule new activities, and track upcoming events.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                            <button onClick={() => setActiveView('list')} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeView === 'list' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>List View</button>
                            <button onClick={() => setActiveView('grid')} className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", activeView === 'grid' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}>Month Grid</button>
                        </div>

                        {/* Add Event Button - Protected by Role */}
                        {hasEventCreationPowers && (
                            <Button variant="dark" onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Event
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* DYNAMIC CONTENT AREA */}
                    {activeView === 'list' ? (
                        <OfficerEventListView
                            events={upcomingEvents}
                            tenant={OFFICER_TENANT_BRANDING}
                            onEventClick={openEventDetails}
                            onDeleteEvent={handleDeleteEvent}
                            canManage={hasEventCreationPowers}
                        />
                    ) : (
                        <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            {/* Reusing the Grid organism */}
                            <EventMonthGrid
                                events={upcomingEvents}
                                tenant={OFFICER_TENANT_BRANDING}
                                onEventClick={openEventDetails}
                                canManageEvents={false} // We already removed the grid's internal button, so false is safe here
                            />
                        </div>
                    )}

                    {/* Right Sidebar - Identical to Member View */}
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

            {/* Modals */}
            <EventDetailsModal
                event={selectedEvent}
                tenant={OFFICER_TENANT_BRANDING}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />

            <EventFormModal
                tenant={OFFICER_TENANT_BRANDING}
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleCreateEvent}
            />

        </AuthenticatedShell>
    );
}