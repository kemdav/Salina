'use client';

import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { EventMonthGrid } from "@/components/organisms/event-month-grid";
import { EventDetailsModal } from "@/components/organisms/event-details-modal";
import { EventFormModal } from "@/components/organisms/event-form-modal";
import { Button } from "@/components/atoms/button";
import { OFFICER_TENANT_BRANDING } from "@/lib/officer-demo-data"; // Make sure this matches your path!
import { CalendarEvent, NewEventPayload } from "@/components/molecules/calendar-day";
// --- DUMMY DATA ---
const dummyEvents = [
    {
        id: 1,
        title: "Arduino Workshop Series",
        date: "2026-05-14", // Ensure this is in the current month you are viewing!
        day: 14,
        month: "MAY",
        time: "8:00 AM - 5:00 PM",
        location: "CPE Labs",
        type: "Workshop",
        status: "Registration Open",
        description: "Hands-on workshop for members."
    }
];

export default function OfficerEventsPage() {
    // 1. Replace 'any' with 'CalendarEvent'
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    // 2. Replace 'any' with 'CalendarEvent'
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsDetailsModalOpen(true);
    };

    // 3. Replace 'any' with 'NewEventPayload'
    const handleCreateEvent = (data: NewEventPayload) => {
        console.log("Creating new event with payload:", data);
        alert(`Dummy Event Created:\n${data.title}\nCheck console for full payload!`);
        // Future: Send to Supabase here
    };

    // Replace with your actual permission logic later
    const hasEventCreationPowers = true;

    return (
        <AuthenticatedShell role="Officer" tenantBranding={OFFICER_TENANT_BRANDING}>
            <div className="w-full max-w-7xl mx-auto py-8 flex flex-col gap-8">

                {/* Page Header */}
                <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-[family:var(--font-heading)]">
                            Event Management
                        </h2>
                        <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                            Schedule upcoming activities, manage RSVPs, and control the organization calendar.
                        </p>
                    </div>

                    {/* Only show the 'New Event' button if they have permission */}
                    {hasEventCreationPowers && (
                        <Button variant="dark" onClick={() => setIsFormModalOpen(true)}>
                            + New Event
                        </Button>
                    )}
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">

                    {/* The Calendar Grid */}
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <EventMonthGrid
                            events={dummyEvents}
                            tenant={OFFICER_TENANT_BRANDING}
                            canManageEvents={hasEventCreationPowers}
                            onEventClick={handleEventClick}
                        />
                    </article>

                    {/* Officer Quick Stats / Side Panel */}
                    <aside className="space-y-6">
                        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">Calendar Overview</h3>
                            <div className="mt-5 space-y-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Upcoming Events</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">Pending RSVPs</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">42</p>
                                </div>
                            </div>
                        </article>
                    </aside>

                </section>
            </div>

            {/* Hidden Modals */}
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