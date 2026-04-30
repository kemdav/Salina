"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";

type View = "list" | "calendar";

type AttendanceStatus = "Verified" | "Pending" | "Flagged";

interface OrgEvent {
  id: string;
  month: string;
  day: number;
  calMonth: number; // 1-based
  name: string;
  location: string;
  time: string;
  attending: number;
  status: "UPCOMING" | "COMPLETED";
}

interface AttendanceRecord {
  member: string;
  event: string;
  checkIn: string;
  status: AttendanceStatus;
}

const EVENTS: OrgEvent[] = [
  {
    id: "1",
    month: "APR",
    day: 28,
    calMonth: 4,
    name: "General Assembly",
    location: "Main Hall",
    time: "6:00 PM",
    attending: 45,
    status: "UPCOMING",
  },
  {
    id: "2",
    month: "MAY",
    day: 3,
    calMonth: 5,
    name: "Leadership Training",
    location: "Conference Room A",
    time: "9:00 AM",
    attending: 12,
    status: "UPCOMING",
  },
  {
    id: "3",
    month: "MAY",
    day: 10,
    calMonth: 5,
    name: "Recruitment Drive",
    location: "Auditorium",
    time: "2:00 PM",
    attending: 80,
    status: "UPCOMING",
  },
  {
    id: "4",
    month: "APR",
    day: 15,
    calMonth: 4,
    name: "Monthly Meeting",
    location: "Online",
    time: "7:00 PM",
    attending: 38,
    status: "COMPLETED",
  },
  {
    id: "5",
    month: "APR",
    day: 5,
    calMonth: 4,
    name: "Team Building",
    location: "Outdoor Area",
    time: "8:00 AM",
    attending: 52,
    status: "COMPLETED",
  },
];

const STATUS_CLASS = {
  UPCOMING: "bg-primary/10 text-primary border-primary/30",
  COMPLETED: "bg-success/10 text-success border-success/30",
};

const STATUS_LABEL = {
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
};

const ATTENDANCE_STATUS_CLASS: Record<AttendanceStatus, string> = {
  Verified: "bg-success/10 text-success border-success/30",
  Pending: "bg-warning/10 text-warning border-warning/30",
  Flagged: "bg-destructive/10 text-destructive border-destructive/30",
};

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    member: "John Doe",
    event: "General Assembly",
    checkIn: "6:02 PM",
    status: "Verified",
  },
  {
    member: "Anna Smith",
    event: "General Assembly",
    checkIn: "6:08 PM",
    status: "Pending",
  },
  {
    member: "Maria Lopez",
    event: "Leadership Training",
    checkIn: "9:01 AM",
    status: "Verified",
  },
  {
    member: "Tom Kim",
    event: "Recruitment Drive",
    checkIn: "2:18 PM",
    status: "Flagged",
  },
];

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

function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function EventsPage() {
  const now = new Date();

  const [view, setView] = useState<View>("list");
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth() + 1);

  function prevMonth() {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  }

  function nextMonth() {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  }

  const cells = getCalendarCells(calYear, calMonth);

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
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-xl border border-border bg-white">
            {(["list", "calendar"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
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

          <Button>+ Create Event</Button>
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-3">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              onClick={() =>
                setSelectedEvent(selectedEvent?.id === event.id ? null : event)
              }
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-colors hover:border-primary/30 ${
                selectedEvent?.id === event.id
                  ? "border-primary/40"
                  : "border-border"
              }`}
            >
              {/* Date box */}
              <div className="min-w-14 rounded-xl bg-primary/10 p-3 text-center text-primary">
                <p className="text-xs font-semibold uppercase">{event.month}</p>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {event.day}
                </p>
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-foreground">
                  {event.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {event.location}
                </p>
                <p className="text-sm text-slate-500">{event.time}</p>
              </div>

              {/* Right */}
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[event.status]}`}
                >
                  {STATUS_LABEL[event.status]}
                </span>
                <p className="text-xs text-slate-500">
                  {event.attending}{" "}
                  {event.status === "UPCOMING" ? "attending" : "attended"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {/* Month navigation */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-500 transition-colors hover:text-foreground"
            >
              ‹
            </button>
            <h2
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {MONTH_NAMES[calMonth - 1]} {calYear}
            </h2>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-slate-500 transition-colors hover:text-foreground"
            >
              ›
            </button>
          </div>

          {/* Day labels */}
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

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const dayEvents = day
                ? EVENTS.filter((e) => e.calMonth === calMonth && e.day === day)
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
                          className="mb-1 truncate rounded bg-primary/10 px-1 text-xs text-primary"
                          title={e.name}
                        >
                          {e.name}
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

      {/* Attendance */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Attendance Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor check-ins, verify attendance, and export member records.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary">Export CSV</Button>
            <Button>Verify All</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50/50">
                {["Member", "Event", "Check-in", "Status"].map((col) => (
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
              {ATTENDANCE_RECORDS.map((record) => (
                <tr
                  key={`${record.member}-${record.event}`}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {record.member}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {record.event}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {record.checkIn}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${ATTENDANCE_STATUS_CLASS[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
