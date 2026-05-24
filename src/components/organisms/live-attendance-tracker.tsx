"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { StatusBanner } from "@/components/molecules/status-banner";
import {
  getAttendanceRecords,
  updateAttendanceStatus,
} from "@/lib/actions/attendance";
import { QRScannerModal } from "@/components/organisms/qr-scanner-modal";

interface OrgEvent {
  id: string;
  title: string;
  qr_attendance_enabled: boolean;
}

interface AttendanceRecord {
  id: string;
  status: string;
  checkIn: string;
  checkOut: string | null;
  member: string;
  memberId: string;
  eventId: string;
}

export function LiveAttendanceTracker({ events }: { events: OrgEvent[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[events.length - 1]?.id || "",
  );

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const loadAttendance = async (eventId: string) => {
    try {
      const data = await getAttendanceRecords(eventId);
      setRecords(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAttendance(selectedEventId);
    }
  }, [selectedEventId]);

  const handleCheckIn = async (recordId: string) => {
    await updateAttendanceStatus(recordId, "Verified");
    if (selectedEventId) loadAttendance(selectedEventId);
  };

  const handleMarkAllPresent = async () => {
    const pendings = records.filter((r) => r.status === "Pending");
    await Promise.all(
      pendings.map((r) => updateAttendanceStatus(r.id, "Verified")),
    );
    if (selectedEventId) loadAttendance(selectedEventId);
  };

  const handleExport = () => {
    if (!selectedEvent) return;
    const escapeCSV = (str: string | null | undefined) => {
      if (!str) return '""';
      const escaped = str.replace(/"/g, '""');
      const sanitized = escaped.match(/^[=+\-@\t\r]/) ? "'" + escaped : escaped;
      return `"${sanitized}"`;
    };
    const csv = [
      ["Member", "Status", "Check-in Time", "Check-out Time"].map(escapeCSV),
      ...records.map((r) =>
        [r.member, r.status, r.checkIn, r.checkOut || ""].map(escapeCSV),
      ),
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
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const pendingRecords = records.filter(
    (r) =>
      r.status === "Pending" &&
      r.member.toLowerCase().includes(search.toLowerCase()),
  );
  const logRecords = records.filter((r) => r.status !== "Pending");

  const checkedInCount = logRecords.filter(
    (r) => r.status === "Verified",
  ).length;
  const lateCount = logRecords.filter((r) => r.status === "Late").length;
  const pendingCount = records.filter((r) => r.status === "Pending").length;

  if (!events.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active events found. Create an event to track attendance.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8 [font-family:var(--font-body)]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-[var(--primary)] text-white">
                Attendance
              </Badge>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                Live event attendance tracker
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Open a check-in session, mark members as present, and keep a
                running attendance log for the event.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleExport}>
              Export log
            </Button>
            {selectedEvent?.qr_attendance_enabled && (
              <Button variant="dark" onClick={() => setIsScannerOpen(true)}>
                Open Scanner
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Checked in</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {checkedInCount}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Late</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {lateCount}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {pendingCount}
            </p>
          </article>
        </div>

        <div className="mt-6">
          <StatusBanner tone="info" className="border-slate-200 bg-slate-50">
            The manual check-in line is live. Participants can be added from the
            queue below.
          </StatusBanner>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
              placeholder="Search check-in queue"
              aria-label="Search attendance queue"
            />
            <Button variant="secondary" onClick={handleMarkAllPresent}>
              Mark all present
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {pendingRecords.length === 0 && (
              <p className="text-slate-500 text-sm">
                No pending attendees found.
              </p>
            )}
            {pendingRecords.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {person.member}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="border border-amber-200 bg-amber-100 text-amber-900">
                    {person.status}
                  </Badge>
                  <Button
                    variant="dark"
                    onClick={() => handleCheckIn(person.id)}
                  >
                    Check in
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Attendance log
            </h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Member</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Check-in
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Check-out
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {logRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-4 text-center text-slate-500"
                      >
                        No checked-in members yet.
                      </td>
                    </tr>
                  )}
                  {logRecords.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {row.member}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {row.checkIn
                          ? new Date(row.checkIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {row.checkOut
                          ? new Date(row.checkOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          className={
                            row.status === "Verified"
                              ? "bg-emerald-100 text-emerald-900"
                              : row.status === "Late"
                                ? "bg-orange-100 text-orange-900"
                                : row.status === "Flagged"
                                  ? "bg-rose-100 text-rose-900"
                                  : "bg-sky-100 text-sky-900"
                          }
                        >
                          {row.status === "Verified" ? "Present" : row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Session notes
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                • Keep a paper backup list available for any QR scan failures.
              </p>
              <p>
                • Review late arrivals after the first 15 minutes of the event.
              </p>
              <p>• Export the completed log before archiving the event.</p>
            </div>
          </article>
        </aside>
      </section>

      {isScannerOpen && selectedEvent && (
        <QRScannerModal
          eventId={selectedEvent.id}
          onClose={() => {
            setIsScannerOpen(false);
            if (selectedEventId) loadAttendance(selectedEventId);
          }}
        />
      )}
    </div>
  );
}
