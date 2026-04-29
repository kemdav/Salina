'use client';
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { EventMonthGrid } from "@/components/organisms/event-month-grid";
import { EventList } from "@/components/organisms/event-list"; // <-- Import the new list
import { EventDetailsModal } from "@/components/organisms/event-details-modal";
import { EventFormModal } from "@/components/organisms/event-form-modal";
import { Button } from "@/components/atoms/button";
import { OFFICER_TENANT_BRANDING, upcomingEvents } from "@/lib/officer-demo-data";
import { CalendarEvent, NewEventPayload } from "@/components/molecules/calendar-day";

export default function OfficerEventsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };

    const handleCreateEvent = (data: NewEventPayload) => {
        console.log("Creating new event with payload:", data);
        alert(`Dummy Event Created:\n${data.title}`);
    };

    const hasEventCreationPowers = true;

    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="w-full max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                            Organization Events
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
                            Manage the calendar, schedule new activities, and track upcoming events.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* View Toggle Control */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                    viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                List
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                    viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Calendar
                            </button>
                        </div>

                        {/* Create Button */}
                        {hasEventCreationPowers && (
                            <Button variant="dark" onClick={() => setIsFormModalOpen(true)} className="flex items-center gap-2 shadow-sm shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create
                            </Button>
                        )}
                    </div>
                </div>

                {/* Conditional View Rendering */}
                <div className="w-full">
                    {viewMode === "grid" ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <EventMonthGrid
                                events={upcomingEvents}
                                tenant={OFFICER_TENANT_BRANDING}
                                canManageEvents={hasEventCreationPowers}
                                onEventClick={handleEventClick}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            <EventList
                                events={upcomingEvents}
                                tenant={OFFICER_TENANT_BRANDING}
                                onEventClick={handleEventClick}
                            />
                        </div>
                    )}
                </div>

            </div>

            {/* Modals remain exactly the same */}
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