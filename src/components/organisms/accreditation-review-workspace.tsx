"use client";

import {
  useCallback,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
} from "react";

import { Button } from "@/components/atoms/button";
import {
  approveApplication,
  rejectApplication,
} from "@/lib/actions/accreditation";

export interface AccreditationOrg {
  id: string;
  name: string;
  type: string;
  priority: string;
  time: string;
}

type DocStatus = "VALID" | "REVIEWING" | "DISCREPANCY" | null;
type Decision = "approved" | "rejected" | null;

interface DocEntry {
  name: string;
  meta: string;
  status: DocStatus;
}

interface OrgDetail {
  name: string;
  submissionId: string;
  submittedBy: string;
  adviser: string;
  dueDate: string;
  documents: DocEntry[];
}

const ORGS = [
  {
    id: 0,
    name: "Organization 1",
    type: "Institutional Investment",
    priority: "PRIORITY",
    time: "24m ago",
  },
  {
    id: 1,
    name: "Organization 2",
    type: "Logistics & Supply",
    priority: "STANDARD",
    time: "2h ago",
  },
  {
    id: 2,
    name: "Organization 3",
    type: "Cloud Infrastructure",
    priority: "STANDARD",
    time: "5h ago",
  },
  {
    id: 3,
    name: "Organization 4",
    type: "Bio-tech Research",
    priority: "STANDARD",
    time: "Yesterday",
  },
  {
    id: 4,
    name: "Organization 5",
    type: "Financial Services",
    priority: "STANDARD",
    time: "1 day ago",
  },
  {
    id: 5,
    name: "Organization 6",
    type: "Healthcare",
    priority: "STANDARD",
    time: "2 days ago",
  },
  {
    id: 6,
    name: "Organization 7",
    type: "Legal Services",
    priority: "PRIORITY",
    time: "3 days ago",
  },
  {
    id: 7,
    name: "Organization 8",
    type: "Education",
    priority: "STANDARD",
    time: "4 days ago",
  },
];

const ORG_DETAILS: Record<number, OrgDetail> = {
  0: {
    name: "Organization 1",
    submissionId: "ACC-0021-VN",
    submittedBy: "Wilson Fisk",
    adviser: "John Doe",
    dueDate: "Apr 14, 2026",
    documents: [
      {
        name: "Articles of Incorporation",
        meta: "PDF · 2.4 MB · Verified",
        status: "VALID",
      },
      {
        name: "Fiscal Responsibility Statement",
        meta: "PDF · 1.1 MB · Pending Review",
        status: "REVIEWING",
      },
      {
        name: "Operational Guidelines v2.4",
        meta: "PDF · 5.8 MB · Verification Required",
        status: "DISCREPANCY",
      },
      { name: "Ethics Compliance Charter", meta: "", status: null },
    ],
  },
  1: {
    name: "Organization 2",
    submissionId: "ACC-0034-VN",
    submittedBy: "Claire Beaumont",
    adviser: "Sarah Lin",
    dueDate: "Apr 18, 2026",
    documents: [
      {
        name: "Certificate of Registration",
        meta: "PDF · 1.8 MB · Verified",
        status: "VALID",
      },
      {
        name: "Financial Audit Report",
        meta: "PDF · 3.2 MB · Verified",
        status: "VALID",
      },
      {
        name: "Governance Charter",
        meta: "PDF · 0.9 MB · Pending Review",
        status: "REVIEWING",
      },
      { name: "Insurance Certificate", meta: "", status: null },
    ],
  },
  2: {
    name: "Organization 3",
    submissionId: "ACC-0047-VN",
    submittedBy: "Marcus Webb",
    adviser: "David Park",
    dueDate: "Apr 22, 2026",
    documents: [
      {
        name: "Articles of Incorporation",
        meta: "PDF · 2.1 MB · Verified",
        status: "VALID",
      },
      {
        name: "Cloud Security Compliance",
        meta: "PDF · 4.4 MB · Verification Required",
        status: "DISCREPANCY",
      },
      {
        name: "Data Handling Agreement",
        meta: "PDF · 1.3 MB · Pending Review",
        status: "REVIEWING",
      },
      { name: "Director Consent Forms", meta: "", status: null },
    ],
  },
  3: {
    name: "Organization 4",
    submissionId: "ACC-0058-VN",
    submittedBy: "Elena Vasquez",
    adviser: "Tom Nguyen",
    dueDate: "Apr 28, 2026",
    documents: [
      {
        name: "Research Ethics Approval",
        meta: "PDF · 2.7 MB · Verified",
        status: "VALID",
      },
      {
        name: "IRB Compliance Certificate",
        meta: "PDF · 1.5 MB · Verified",
        status: "VALID",
      },
      {
        name: "Bio-safety Protocol",
        meta: "PDF · 3.9 MB · Pending Review",
        status: "REVIEWING",
      },
      { name: "Funding Disclosure Statement", meta: "", status: null },
    ],
  },
  4: {
    name: "Organization 5",
    submissionId: "ACC-0063-VN",
    submittedBy: "James Hartley",
    adviser: "Sarah Lin",
    dueDate: "May 2, 2026",
    documents: [
      {
        name: "Financial Services Licence",
        meta: "PDF · 1.9 MB · Verified",
        status: "VALID",
      },
      {
        name: "AML Compliance Report",
        meta: "PDF · 2.3 MB · Pending Review",
        status: "REVIEWING",
      },
      {
        name: "Director ID Verification",
        meta: "PDF · 0.8 MB · Verified",
        status: "VALID",
      },
      { name: "Client Fund Policy", meta: "", status: null },
    ],
  },
  5: {
    name: "Organization 6",
    submissionId: "ACC-0071-VN",
    submittedBy: "Nina Patel",
    adviser: "John Doe",
    dueDate: "May 5, 2026",
    documents: [
      {
        name: "Healthcare Provider Licence",
        meta: "PDF · 3.1 MB · Verified",
        status: "VALID",
      },
      {
        name: "Privacy Impact Assessment",
        meta: "PDF · 2.0 MB · Verification Required",
        status: "DISCREPANCY",
      },
      {
        name: "Clinical Governance Policy",
        meta: "PDF · 1.4 MB · Pending Review",
        status: "REVIEWING",
      },
      { name: "Indemnity Insurance", meta: "", status: null },
    ],
  },
  6: {
    name: "Organization 7",
    submissionId: "ACC-0079-VN",
    submittedBy: "Robert Crane",
    adviser: "David Park",
    dueDate: "May 8, 2026",
    documents: [
      {
        name: "Legal Practice Certificate",
        meta: "PDF · 1.2 MB · Verified",
        status: "VALID",
      },
      {
        name: "Professional Indemnity",
        meta: "PDF · 0.9 MB · Verified",
        status: "VALID",
      },
      {
        name: "Conflicts of Interest Policy",
        meta: "PDF · 1.6 MB · Pending Review",
        status: "REVIEWING",
      },
      { name: "Trust Account Declaration", meta: "", status: null },
    ],
  },
  7: {
    name: "Organization 8",
    submissionId: "ACC-0085-VN",
    submittedBy: "Anne Buckley",
    adviser: "Tom Nguyen",
    dueDate: "May 12, 2026",
    documents: [
      {
        name: "Education Provider Registration",
        meta: "PDF · 2.5 MB · Verified",
        status: "VALID",
      },
      {
        name: "Safeguarding Policy",
        meta: "PDF · 1.7 MB · Pending Review",
        status: "REVIEWING",
      },
      {
        name: "Curriculum Framework",
        meta: "PDF · 3.3 MB · Verified",
        status: "VALID",
      },
      { name: "Staff Background Checks", meta: "", status: null },
    ],
  },
};

function getOrgDetail(orgId: string | number, orgName: string): OrgDetail {
  const mockDetail = ORG_DETAILS[Number(orgId)];
  if (mockDetail) return mockDetail;

  return {
    name: orgName,
    submissionId: `ACC-${String(orgId).substring(0, 8).toUpperCase()}`,
    submittedBy: "Unknown Applicant",
    adviser: "Pending Assignment",
    dueDate: "N/A",
    documents: [
      {
        name: "Initial Application",
        meta: "System Generated",
        status: "REVIEWING",
      },
    ],
  };
}

function initialStatuses(detail: OrgDetail): Record<string, DocStatus> {
  return Object.fromEntries(
    detail.documents.map((document) => [document.name, document.status]),
  );
}

function StatusPill({ status }: { status: DocStatus }) {
  if (!status) {
    return null;
  }

  const styles: Record<Exclude<DocStatus, null>, string> = {
    VALID: "border-success/30 text-success bg-success/10",
    REVIEWING: "border-warning/30 text-warning bg-warning/10",
    DISCREPANCY: "border-destructive/30 text-destructive bg-destructive/10",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-8 w-8 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-8 w-8 text-destructive"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface NoteEntry {
  id: string;
  text: string;
  timestamp: string;
}

export function AccreditationReviewWorkspace({
  initialOrgs = [],
}: {
  initialOrgs?: AccreditationOrg[];
}) {
  const displayOrgs =
    initialOrgs !== undefined
      ? initialOrgs
      : (ORGS as unknown as AccreditationOrg[]);
  const [selectedOrg, setSelectedOrg] = useState<string>(
    String(displayOrgs[0]?.id || "0"),
  );
  const [currentNote, setCurrentNote] = useState("");
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [isPending, startTransition] = useTransition();
  const noteIdRef = useRef(0);

  const selectedOrgData =
    displayOrgs.find((o) => String(o.id) === selectedOrg) || displayOrgs[0];
  const detail = selectedOrgData
    ? getOrgDetail(selectedOrg, selectedOrgData.name)
    : ORG_DETAILS[0];

  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>(
    () => initialStatuses(detail),
  );
  const [docNotes, setDocNotes] = useState<Record<string, string>>({});
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const reviewedCount = detail.documents.filter(
    (document) => docStatuses[document.name] !== document.status,
  ).length;
  const canApprove = detail.documents.length === 1 ? true : reviewedCount >= 3;

  function selectOrg(id: string, name: string) {
    setSelectedOrg(id);
    setDecision(null);
    setCurrentNote("");
    setNotes([]);
    setEditingNoteId(null);
    setEditingText("");
    setExpandedDoc(null);
    setDocStatuses(initialStatuses(getOrgDetail(id, name)));
    setDocNotes({});
  }

  const handleAddNote = useCallback(() => {
    if (!currentNote.trim()) {
      return;
    }

    noteIdRef.current += 1;
    setNotes((prev) => [
      ...prev,
      {
        id: String(noteIdRef.current),
        text: currentNote.trim(),
        timestamp: "Just now",
      },
    ]);
    setCurrentNote("");
  }, [currentNote]);

  function startEdit(note: NoteEntry) {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  }

  function saveEdit(id: string) {
    if (!editingText.trim()) {
      return;
    }

    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, text: editingText.trim() } : note,
      ),
    );
    setEditingNoteId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setEditingText("");
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function toggleDoc(name: string) {
    setExpandedDoc((prev) => (prev === name ? null : name));
  }

  function updateDocStatus(name: string, status: Exclude<DocStatus, null>) {
    setDocStatuses((prev) => ({ ...prev, [name]: status }));
  }

  function handleDownload(e: MouseEvent, name: string) {
    e.stopPropagation();
    setDownloadingDoc(name);
    setTimeout(() => setDownloadingDoc(null), 1500);
  }

  if (displayOrgs.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div>
          <p className="text-sm font-light uppercase tracking-wide text-slate-500">
            Super Admin Review
          </p>
          <h1
            className="mt-1 text-4xl font-bold leading-none tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Review Application.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Verify organization details and approve or reject the accreditation
            request.
          </p>
        </div>
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50/50">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🎉
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              All caught up!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              There are no pending accreditation requests to review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div>
        <p className="text-sm font-light uppercase tracking-wide text-slate-500">
          Super Admin Review
        </p>
        <h1
          className="mt-1 text-4xl font-bold leading-none tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Review Application.
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Verify organization details and approve or reject the accreditation
          request.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {decision === null ? (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            <div className="border-b border-border lg:border-b-0 lg:border-r">
              <div className="border-b border-border px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {displayOrgs.length} Organizations Pending
                </span>
              </div>
              {displayOrgs.map((org) => {
                const isSelected = selectedOrg === String(org.id);

                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => selectOrg(String(org.id), org.name)}
                    className={`block w-full border-b border-border px-4 py-4 text-left transition-colors last:border-0 ${
                      isSelected
                        ? "border-l-2 border-l-primary bg-primary/5"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">
                        {org.priority}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {org.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {org.name}
                    </p>
                    <p className="text-xs text-slate-500">{org.type}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-6 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {detail.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Submission ID: {detail.submissionId}
                  </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-slate-100">
                  <span className="text-[10px] italic text-slate-500">
                    logo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 md:grid-cols-3">
                {[
                  { label: "Submitted By", value: detail.submittedBy },
                  { label: "Assigned Adviser", value: detail.adviser },
                  { label: "Due Date", value: detail.dueDate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="mb-1 text-xs uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Documentation Checklist ({detail.documents.length})
                </p>
                <ul>
                  {detail.documents.map(({ name, meta }) => {
                    const status = docStatuses[name] ?? null;
                    const isExpanded = expandedDoc === name;
                    const isDownloading = downloadingDoc === name;

                    return (
                      <li
                        key={name}
                        className="border-b border-border last:border-0"
                      >
                        <div
                          className="-mx-1 flex cursor-pointer items-center gap-3 rounded-sm px-1 py-3 transition-colors hover:bg-slate-50/60"
                          onClick={() => toggleDoc(name)}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-slate-50 text-sm">
                            📄
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {name}
                            </p>
                            {meta ? (
                              <p className="text-xs text-slate-500">{meta}</p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <StatusPill status={status} />
                            <button
                              type="button"
                              onClick={(event) => handleDownload(event, name)}
                              className="ml-1 text-sm transition-colors hover:text-foreground"
                              style={{ color: "var(--muted)" }}
                              aria-label="Download"
                              title="Document preview available after deployment"
                            >
                              {isDownloading ? (
                                <span className="text-xs text-slate-500">
                                  Downloading…
                                </span>
                              ) : (
                                "↓"
                              )}
                            </button>
                          </div>
                        </div>

                        {isExpanded ? (
                          <div
                            className="mx-1 mb-3 rounded-(--radius) border border-border bg-slate-50/50 p-3"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                              Reviewer Notes
                            </p>
                            <textarea
                              className="w-full resize-none rounded-(--radius) border border-border bg-background p-2.5 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted"
                              placeholder="Add notes about this document..."
                              rows={2}
                              value={docNotes[name] ?? ""}
                              onChange={(event) =>
                                setDocNotes((prev) => ({
                                  ...prev,
                                  [name]: event.target.value,
                                }))
                              }
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => updateDocStatus(name, "VALID")}
                                className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success/20"
                              >
                                Mark Valid
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocStatus(name, "REVIEWING")
                                }
                                className="rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning transition-colors hover:bg-warning/20"
                              >
                                Flag for Review
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateDocStatus(name, "DISCREPANCY")
                                }
                                className="rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                              >
                                Mark Discrepancy
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  System Admin Note
                </p>
                <textarea
                  className="w-full resize-none rounded-(--radius) border border-border bg-background p-3 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted"
                  placeholder="Add a note visible to system administrators only..."
                  rows={3}
                  value={currentNote}
                  onChange={(event) => setCurrentNote(event.target.value)}
                />
                <p className="mt-1 text-xs text-slate-500">
                  <svg
                    className="mr-1 inline h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Visible to Super Admins only
                </p>

                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="mt-2 rounded-(--radius) border border-border bg-slate-50 p-3"
                  >
                    {editingNoteId === note.id ? (
                      <>
                        <textarea
                          className="w-full resize-none rounded-(--radius) border border-border bg-background p-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                          rows={2}
                          value={editingText}
                          onChange={(event) =>
                            setEditingText(event.target.value)
                          }
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                            onClick={() => saveEdit(note.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-slate-100"
                            style={{ color: "var(--muted)" }}
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm text-foreground">{note.text}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {note.timestamp} · Super Admin
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            className="rounded px-2 py-0.5 text-xs transition-colors hover:bg-slate-200"
                            style={{ color: "var(--muted)" }}
                            onClick={() => startEdit(note)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded px-2 py-0.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                            onClick={() => deleteNote(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  type="button"
                  className="text-sm transition-colors hover:text-foreground"
                  style={{ color: "var(--muted)" }}
                  onClick={handleAddNote}
                >
                  Add Internal Note
                </button>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        await rejectApplication(selectedOrg);
                        setDecision("rejected");
                      });
                    }}
                  >
                    {isPending ? "Rejecting..." : "Reject"}
                  </Button>
                  <span
                    title={
                      !canApprove
                        ? "Review all documents before approving"
                        : undefined
                    }
                  >
                    <Button
                      disabled={!canApprove || isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await approveApplication(selectedOrg);
                          setDecision("approved");
                        });
                      }}
                    >
                      {isPending ? "Approving..." : "Approve Accreditation"}
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {decision === "approved" ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckIcon />
            </div>
            <h2
              className="mb-2 text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Accreditation Approved
            </h2>
            <p className="max-w-sm text-sm text-slate-500">
              {detail.name} has been approved. The owner will receive an email
              invitation to complete their organization setup.
            </p>
          </div>
        ) : null}

        {decision === "rejected" ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XIcon />
            </div>
            <h2
              className="mb-2 text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Accreditation Rejected
            </h2>
            <p className="max-w-sm text-sm text-slate-500">
              {detail.name} has been notified of the decision.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => setDecision(null)}
            >
              ← Back to Review
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
