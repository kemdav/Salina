import { getMyAttendance } from "@/lib/actions/attendance";
import { Badge } from "@/components/atoms/badge";

const STATUS_VARIANT: Record<string, "success" | "secondary" | "destructive" | "default"> = {
  Verified: "success",
  Pending: "secondary",
  Flagged: "destructive",
  Rejected: "default",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MemberAttendancePage() {
  const records = await getMyAttendance();

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>
        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">No attendance history yet</h2>
          <p className="mt-1 text-sm text-slate-500">
            When you RSVP to events, your attendance will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>

      <ul className="mt-6 space-y-3">
        {records.map((record) => (
          <li
            key={record.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-slate-900">
                  {record.eventTitle}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{record.location}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(record.eventDate)}
                  </span>
                  {record.checkInTime && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      In: {formatTime(record.checkInTime)}
                    </span>
                  )}
                  {record.checkOutTime && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <svg
                        width="14"
                        height="14"
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
                      Out: {formatTime(record.checkOutTime)}
                    </span>
                  )}
                </div>
              </div>
              <Badge
                variant={STATUS_VARIANT[record.status] ?? "default"}
                className="shrink-0"
              >
                {record.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
