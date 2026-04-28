'use client';

import { useState } from "react";
import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { cn } from "@/lib/utils";

// --- DUMMY DATA (PLACEHOLDER) ---
// NOTE FOR PR: All events and tenant details here are hardcoded placeholders 
// for UI mockup purposes. They will be replaced by Supabase data later.
const dummyTenant = {
    name: "Cebu Institute of Technology - University",
    primaryColor: "#c6623e",
    textColor: "#ffffff"
};

const upcomingEvents = [
    {
        id: 1,
        title: "Bytes & Boards: Introduction to Arduino Basics",
        date: "Mar 14, 2026",
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
        date: "Apr 11, 2026",
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
        date: "May 15, 2026",
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
function EventListView() {
    return (
        <div className="flex-1 w-full space-y-4 animate-in fade-in duration-300">
            {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5">
                    {/* Date Block */}
                    <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{event.month}</span>
                        <span className="text-2xl font-black text-slate-800 leading-none mt-1">{event.day}</span>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{ backgroundColor: `${dummyTenant.primaryColor}15`, color: dummyTenant.primaryColor }}
                            >
                                {event.type}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {event.time}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {event.location}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-5 mt-2 sm:mt-0">
                        <button className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- ORGANISM 2: THE MONTH GRID VIEW ---
function EventMonthGrid() {
    // A simplified 35-block grid representing a generic month (e.g., April 2026)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Creating an array of 30 days, padded with empty blocks for layout
    const blanks = Array.from({ length: 3 }, (_, i) => i); // Starts on Wed
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300">
            {/* Header: Days of the week */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {daysOfWeek.map((day) => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 auto-rows-[100px] sm:auto-rows-[120px]">
                {blanks.map((blank) => (
                    <div key={`blank-${blank}`} className="border-b border-r border-slate-100 bg-slate-50/50 p-2" />
                ))}

                {daysInMonth.map((day) => {
                    // Check if there is an event on this day (filtering only April events for the mockup)
                    const dayEvents = upcomingEvents.filter(e => e.day === day && e.month === "APR");
                    const hasEvent = dayEvents.length > 0;

                    return (
                        <div key={`day-${day}`} className={cn(
                            "border-b border-r border-slate-100 p-2 relative transition-colors",
                            hasEvent ? "bg-white hover:bg-slate-50" : "bg-white"
                        )}>
                            <span className={cn(
                                "inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1",
                                day === 11 ? "bg-slate-900 text-white" : "text-slate-700" // Mocking "Today" or specific highlight
                            )}>
                                {day}
                            </span>

                            {/* Render Event Pill if exists */}
                            <div className="space-y-1 overflow-y-auto max-h-[70px] no-scrollbar">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="text-[10px] leading-tight px-1.5 py-1 rounded border shadow-sm truncate cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{
                                            backgroundColor: `${dummyTenant.primaryColor}15`,
                                            color: dummyTenant.primaryColor,
                                            borderColor: `${dummyTenant.primaryColor}30`
                                        }}
                                        title={event.title}
                                    >
                                        <span className="font-bold">{event.time.split(' ')[0]}</span> {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- MASTER TEMPLATE / PAGE ---
export default function MemberCalendarPage() {
    // State to handle the active view!
    const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

    return (
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>
            <div className="w-full max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Page Header & View Toggles */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-[family:var(--font-heading)]">
                            Event Calendar
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Stay up to date with upcoming workshops, assemblies, and deadlines.
                        </p>
                    </div>

                    {/* WORKING View Toggles */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setActiveView('list')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                activeView === 'list' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setActiveView('grid')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                activeView === 'grid' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Month Grid
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* DYNAMIC CONTENT AREA */}
                    {activeView === 'list' ? <EventListView /> : <EventMonthGrid />}

                    {/* Right Sidebar: Filters & Quick Actions */}
                    <div className="w-full lg:w-72 shrink-0 space-y-6">

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Filter Events</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Workshops</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Competitions</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">General Assemblies</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="font-bold text-slate-800">Perfect Attendance!</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                You have attended 100% of the mandatory events this semester. Keep it up!
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedShell>
    );
}