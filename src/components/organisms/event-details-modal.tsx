import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { CalendarEvent, TenantBranding } from "@/components/molecules/calendar-day";

interface EventDetailsModalProps {
    event: CalendarEvent | null;
    tenant: TenantBranding;
    isOpen: boolean;
    onClose: () => void;
}

export function EventDetailsModal({ event, tenant, isOpen, onClose }: EventDetailsModalProps) {
    const [isRsvpd, setIsRsvpd] = useState(false);


    if (!isOpen || !event) return null;

    const handleRsvp = () => {
        setIsRsvpd(true);
        console.log(`[Database Sync] User successfully RSVP'd to event ID: ${event.id}`);
    };

    const handleCloseModal = () => {
        setIsRsvpd(false); // Reset the RSVP state
        onClose();         // Actually close the modal
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={handleCloseModal} // Use the new close handler here
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Themed Header */}
                <div
                    className="px-6 py-6 sm:px-8 sm:py-8 relative shrink-0"
                    style={{ backgroundColor: tenant.primaryColor, color: tenant.textColor }}
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-start gap-4">
                        <div>
                            <Badge className="bg-white/20 text-white border-transparent hover:bg-white/30 mb-3 shadow-sm">
                                {event.type}
                            </Badge>
                            <h2 className="text-2xl sm:text-3xl font-bold font-[family:var(--font-heading)] leading-tight">
                                {event.title}
                            </h2>
                        </div>
                        {/* Event Date Block */}
                        <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-2.5 min-w-[4rem] shrink-0 border border-white/10 shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">{event.month}</span>
                            <span className="text-2xl font-black leading-none mt-1">{event.day}</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">

                    {/* Meta Info (Time & Location) */}
                    <div className="flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm shrink-0">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-sm font-semibold">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm shrink-0">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <span className="text-sm font-semibold">{event.location}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About this event</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {event.description}
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                    <button
                        onClick={handleCloseModal} // Use the new close handler here
                        className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Close
                    </button>

                    {/* CONDITIONAL RSVP BUTTON */}
                    {isRsvpd ? (
                        <Button
                            variant="secondary"
                            disabled
                            className="opacity-70 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-600 font-bold"
                        >
                            <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            Already Going
                        </Button>
                    ) : (
                        <Button
                            variant="dark"
                            onClick={handleRsvp}
                            style={{ backgroundColor: tenant.primaryColor }}
                            className="hover:opacity-90 shadow-md font-bold px-6"
                        >
                            I&apos;m Going!
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}