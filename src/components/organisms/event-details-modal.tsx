import { useState } from "react";
import {
  CalendarEvent,
  TenantBranding,
} from "@/components/molecules/calendar-day";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  tenant: TenantBranding;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({
  event,
  tenant,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  // 1. Local state for RSVP status for nwo, to simulate the user action and UI feedback
  const [isRsvpd, setIsRsvpd] = useState(false);

  if (!event) return null;

  // 2. Cclose action to reset our dummy state
  const handleCloseModal = () => {
    setIsRsvpd(false); // Reset the RSVP state
    onClose(); // Actually close the modal
  };

  // 3. Handle the RSVP action
  const handleRsvp = () => {
    setIsRsvpd(true);
    // Future Implementation: Send RSVP to Supabase AND trigger Google Calendar save
    console.log(
      `[Database Sync] User successfully RSVP'd to event ID: ${event.id}`,
    );
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-300",
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/40 transition duration-300",
          isOpen
            ? "opacity-100 backdrop-blur-sm"
            : "opacity-0 backdrop-blur-none",
        )}
        onClick={handleCloseModal}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95",
        )}
      >
        <div
          className="px-6 py-8 relative shrink-0"
          style={{
            backgroundColor: tenant.primaryColor,
            color: tenant.textColor,
          }}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />

          <div className="relative z-10 pr-8">
            <div className="flex gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/10">
                {event.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/10">
                {event.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight font-[family:var(--font-heading)]">
              {event.title}
            </h2>
          </div>

          <Button
            variant="ghost"
            onClick={handleCloseModal} // Updated to reset state
            className="absolute top-4 right-4 p-2 h-auto rounded-full hover:bg-white/10 hover:text-white transition-colors z-20"
            style={{ color: tenant.textColor }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Date & Time
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {event.month} {event.day}, {event.date.split("-")[0]}
                </p>
                <p className="text-xs text-slate-500">{event.time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Location
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
              About This Event
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <Button
            variant="ghost"
            onClick={handleCloseModal} // Updated to reset state
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </Button>

          {/* 4. CONDITIONAL RSVP BUTTON */}
          {isRsvpd ? (
            <Button
              disabled
              variant="secondary"
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-slate-500 bg-slate-200 cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1.5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Already Going
            </Button>
          ) : (
            <Button
              onClick={handleRsvp}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              I&apos;m Going!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
