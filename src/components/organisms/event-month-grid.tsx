'use client';

import { useState } from "react";
import { CalendarDayCell, CalendarEvent, TenantBranding } from "@/components/molecules/calendar-day";

interface EventMonthGridProps {
    events: CalendarEvent[];
    tenant: TenantBranding;
    canManageEvents?: boolean;
    onEventClick?: (event: CalendarEvent) => void;
}

export function EventMonthGrid({ events, tenant, canManageEvents = false, onEventClick }: EventMonthGridProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl overflow-visible shadow-sm animate-in fade-in duration-300">

            {/* Header: Dynamic Month/Year Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-white rounded-t-xl gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    {monthNames[month]} {year}
                </h3>

                <div className="flex items-center gap-4">
                    {/* Only show this if they are an Officer/Admin */}
                    {canManageEvents && (
                        <button
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 flex items-center gap-1.5 shadow-sm"
                            style={{ backgroundColor: tenant.primaryColor }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            New Event
                        </button>
                    )}

                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 rounded-md border border-slate-200 transition-colors shadow-sm">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={handleNextMonth} className="p-1.5 sm:p-2 bg-white hover:bg-slate-50 rounded-md border border-slate-200 transition-colors shadow-sm">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 rounded-b-xl overflow-hidden">
                {blanks.map(blank => (
                    <div key={`blank-${blank}`} className="border-b border-r border-slate-100 bg-slate-50/50 p-2 min-h-[100px] sm:min-h-[120px]" />
                ))}

                {days.map(day => {
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateString);

                    const isToday = dateString === "2026-03-11";

                    return (
                        <CalendarDayCell
                            key={`day-${day}`}
                            day={day}
                            events={dayEvents}
                            tenant={tenant}
                            isToday={isToday}
                            onEventClick={onEventClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}