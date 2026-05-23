"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { createEvent, deleteEvent, getEvents } from "@/lib/actions/events";
import {
  updateAttendanceStatus,
  getAttendanceRecords,
} from "@/lib/actions/attendance";

type View = "list" | "calendar";

interface OrgEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

export function EventsManager({
  initialEvents,
  canManage,
}: {
  initialEvents: OrgEvent[];
  canManage: boolean;
}) {
  const [view, setView] = useState<View>("list");
  const [events, setEvents] = useState<OrgEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<
    {
      id: string;
      status: string;
      checkIn: string;
      member: string;
      memberId: string;
      eventId: string;
    }[]
  >([]);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function loadAttendance(eventId: string) {
    try {
      const records = await getAttendanceRecords(eventId);
      setAttendanceRecords(records);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (selectedEvent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAttendance(selectedEvent.id);
    }
  }, [selectedEvent]);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createEvent({
        title,
        location,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });
      setIsCreating(false);
      const updated = await getEvents();
      setEvents(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteEvent(id);
      const updated = await getEvents();
      setEvents(updated);
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleStatusChange(recordId: string, status: string) {
    try {
      await updateAttendanceStatus(recordId, status);
      if (selectedEvent) loadAttendance(selectedEvent.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
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
          Events
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-xl border border-border bg-white">
            {(["list", "calendar"] as View[]).map((v) => (
              <Button
                variant="ghost"
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors rounded-none ${
                  view === v
                    ? "bg-foreground text-background"
                    : "text-slate-500 hover:text-foreground hover:bg-transparent"
                }`}
              >
                {v}
              </Button>
            ))}
          </div>
          {canManage && (
            <Button onClick={() => setIsCreating(true)}>+ Create Event</Button>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="mb-8 p-6 bg-white border border-border rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Start Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  End Time
                </label>
                <input
                  required
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Event</Button>
            </div>
          </form>
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-3">
          {events.length === 0 && (
            <p className="text-slate-500">No events found.</p>
          )}
          {events.map((event) => {
            const startDate = new Date(event.start_time);
            const monthStr = MONTH_NAMES[startDate.getMonth()]
              .substring(0, 3)
              .toUpperCase();
            return (
              <div
                key={event.id}
                onClick={() =>
                  setSelectedEvent(
                    selectedEvent?.id === event.id ? null : event,
                  )
                }
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-colors hover:border-primary/30 ${
                  selectedEvent?.id === event.id
                    ? "border-primary/40 bg-slate-50"
                    : "border-border"
                }`}
              >
                <div className="min-w-14 rounded-xl bg-primary/10 p-3 text-center text-primary">
                  <p className="text-xs font-semibold uppercase">{monthStr}</p>
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
                {canManage && (
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Button
              variant="secondary"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center p-0"
            >
              ‹
            </Button>
            <h2 className="text-base font-bold text-foreground">
              {MONTH_NAMES[calMonth - 1]} {calYear}
            </h2>
            <Button
              variant="secondary"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center p-0"
            >
              ›
            </Button>
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
                        <Button
                          key={e.id}
                          variant="ghost"
                          onClick={() => setSelectedEvent(e)}
                          className="mb-1 w-full truncate rounded bg-primary/10 px-1 text-left text-xs text-primary hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 h-auto py-0.5 justify-start block"
                          title={e.title}
                        >
                          {e.title}
                        </Button>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Section */}
      {selectedEvent && canManage && (
        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Attendance Records: {selectedEvent.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Monitor check-ins, verify attendance, and export member records.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const escapeCSV = (str: string | null | undefined) => {
                    if (!str) return '""';
                    const escaped = str.replace(/"/g, '""');
                    const sanitized = escaped.match(/^[=+\-@\t\r]/) ? "'" + escaped : escaped;
                    return `"${sanitized}"`;
                  };
                  const csv = [
                    ["Member", "Status", "Check-in Time"].map(escapeCSV),
                    ...attendanceRecords.map((r) => [
                      r.member,
                      r.status,
                      r.checkIn,
                    ].map(escapeCSV)),
                  ]
                    .map((e) => e.join(","))
                    .join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `attendance-${selectedEvent.id}.csv`;
                  a.click();
                  setTimeout(() => window.URL.revokeObjectURL(url), 100);
                }}
              >
                Export CSV
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50/50">
                  {["Member", "Check-in", "Status", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-sm text-slate-500 text-center"
                    >
                      No attendees yet.
                    </td>
                  </tr>
                )}
                {attendanceRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {record.member}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {record.checkIn}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                          record.status === "Verified"
                            ? "bg-success/10 text-success border-success/30"
                            : record.status === "Pending"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : record.status === "Flagged"
                                ? "bg-destructive/10 text-destructive border-destructive/30"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {record.status !== "Verified" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleStatusChange(record.id, "Verified")
                          }
                        >
                          Verify
                        </Button>
                      )}
                      {record.status !== "Flagged" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleStatusChange(record.id, "Flagged")
                          }
                        >
                          Flag
                        </Button>
                      )}
                      {record.status !== "Rejected" && (
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleStatusChange(record.id, "Rejected")
                          }
                        >
                          Reject
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
