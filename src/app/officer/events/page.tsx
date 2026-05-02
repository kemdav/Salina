"use client";

import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { cn } from "@/lib/utils";
import { EventMonthGrid } from "@/components/organisms/event-month-grid";
import { EventDetailsModal } from "@/components/organisms/event-details-modal";
import { EventFormModal } from "@/components/organisms/event-form-modal";
import { Button } from "@/components/atoms/button";
import { EventList } from "@/components/molecules/event-list";
import {
  OFFICER_TENANT_BRANDING,
  upcomingEvents,
} from "@/lib/officer-demo-data";
import {
  CalendarEvent,
  NewEventPayload,
} from "@/components/molecules/calendar-day";

// --- MASTER TEMPLATE / PAGE ---
export default function OfficerEventsPage() {
  const [activeView, setActiveView] = useState<"list" | "grid">("list");

  // Modals State
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
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
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this event?",
    );
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
            <h2
              className="text-2xl font-bold text-slate-800 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Event Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage the calendar, schedule new activities, and track upcoming
              events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveView("list")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeView === "list"
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView("grid")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeView === "grid"
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                Month Grid
              </button>
            </div>

            {/* Add Event Button - Protected by Role */}
            {hasEventCreationPowers && (
              <Button
                variant="dark"
                onClick={() => setIsFormModalOpen(true)}
                className="flex items-center gap-2 shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Event
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* DYNAMIC CONTENT AREA */}
          {activeView === "list" ? (
            <EventList
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
              />
            </div>
          )}

          {/* Right Sidebar - Identical to Member View */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Filter Events</h3>
              <div className="space-y-3">
                {["Workshops", "Competitions", "General Assemblies"].map(
                  (filter) => (
                    <label
                      key={filter}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        {filter}
                      </span>
                    </label>
                  ),
                )}
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
