"use client";

import { useState } from "react";
import { participateInEvent } from "@/lib/actions/attendance";
import { Button } from "@/components/atoms/button";

type View = "list" | "calendar";

interface OrgEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

interface MemberAttendance {
  event_id: string;
  status: string;
}

export function MemberEventsManager({
  events,
  initialAttendance,
}: {
  events: OrgEvent[];
  initialAttendance: MemberAttendance[];
}) {
  const [view, setView] = useState<View>("list");
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const [attendance, setAttendance] =
    useState<MemberAttendance[]>(initialAttendance);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);

  async function handleParticipate(eventId: string) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await participateInEvent(eventId);
      setAttendance((prev) => [
        ...prev,
        { event_id: eventId, status: "Pending" },
      ]);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const prevMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const getCalendarCells = (year: number, month: number) => {
    const firstDow = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells: (number | null)[] = Array(firstDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };
  const cells = getCalendarCells(calYear, calMonth);
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Event Calendar
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-border bg-white">
            {(["list", "calendar"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  view === v
                    ? "bg-foreground text-background"
                    : "text-slate-500 hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* LIST VIEW */}
          {view === "list" && (
            <div className="space-y-3">
              {events.length === 0 && (
                <p className="text-slate-500">No upcoming events.</p>
              )}
              {events.map((event) => {
                const startDate = new Date(event.start_time);
                const monthStr = MONTH_NAMES[startDate.getMonth()]
                  .substring(0, 3)
                  .toUpperCase();
                const att = attendance.find((a) => a.event_id === event.id);
                return (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-colors hover:border-primary/30 border-border"
                  >
                    <div className="min-w-14 rounded-xl bg-primary/10 p-3 text-center text-primary">
                      <p className="text-xs font-semibold uppercase">
                        {monthStr}
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {startDate.getDate()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-foreground">
                        {event.title}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {event.location}
                      </p>
                      <p className="text-sm text-slate-500">
                        {startDate.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedEvent(event)}
                      >
                        View Details
                      </Button>
                      {att && (
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                            att.status === "Verified"
                              ? "bg-success/10 text-success border-success/30"
                              : att.status === "Pending"
                                ? "bg-warning/10 text-warning border-warning/30"
                                : att.status === "Flagged"
                                  ? "bg-destructive/10 text-destructive border-destructive/30"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          {att.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {view === "calendar" && (
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-500 hover:text-foreground"
                >
                  ‹
                </button>
                <h2 className="text-base font-bold text-foreground">
                  {MONTH_NAMES[calMonth - 1]} {calYear}
                </h2>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-500 hover:text-foreground"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 border-b border-border">
                {DAY_LABELS.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-500"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  const dayEvents = day
                    ? events.filter((e) => {
                        const d = new Date(e.start_time);
                        return (
                          d.getFullYear() === calYear &&
                          d.getMonth() + 1 === calMonth &&
                          d.getDate() === day
                        );
                      })
                    : [];
                  return (
                    <div
                      key={i}
                      className="min-h-20 border-b border-r border-border p-2 last:border-r-0 nth-[7n]:border-r-0"
                    >
                      {day && (
                        <>
                          <p className="mb-1 text-sm text-center text-foreground">
                            {day}
                          </p>
                          {dayEvents.map((e) => (
                            <div
                              key={e.id}
                              onClick={() => setSelectedEvent(e)}
                              className="mb-1 truncate cursor-pointer rounded bg-primary/10 px-1 text-xs text-primary hover:bg-primary/20"
                              title={e.title}
                            >
                              {e.title}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* My Participations sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <h3
              className="font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              My Participations
            </h3>
            <div className="space-y-4">
              {attendance.length === 0 && (
                <p className="text-sm text-slate-500">
                  You haven&apos;t participated in any events yet.
                </p>
              )}
              {attendance.map((att) => {
                const event = events.find((e) => e.id === att.event_id);
                if (!event) return null;
                return (
                  <div
                    key={att.event_id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.start_time).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        att.status === "Verified"
                          ? "bg-success/10 text-success border-success/30"
                          : att.status === "Pending"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : att.status === "Flagged"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-8 relative shrink-0 bg-primary text-primary-foreground">
              <div className="relative z-10 pr-8">
                <h2
                  className="text-2xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-20"
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
              </button>
            </div>
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
                      {new Date(selectedEvent.start_time).toLocaleString()}
                    </p>
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
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  About This Event
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <Button
                variant="secondary"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
              {attendance.some((a) => a.event_id === selectedEvent.id) ? (
                <Button disabled variant="secondary">
                  Already Going
                </Button>
              ) : (
                <Button
                  onClick={() => handleParticipate(selectedEvent.id)}
                  disabled={isSubmitting}
                >
                  Participate
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
