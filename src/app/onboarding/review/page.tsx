"use client";

import { useState, useCallback, useRef } from "react";

import { Button } from "@/components/atoms/button";
import { OnboardingHeader } from "@/components/organisms/onboarding-header";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocStatus = "VALID" | "REVIEWING" | "DISCREPANCY" | null;
type Decision = "approved" | "rejected" | null;

interface DocEntry { name: string; meta: string; status: DocStatus }
interface OrgDetail {
  name: string;
  submissionId: string;
  submittedBy: string;
  adviser: string;
  dueDate: string;
  documents: DocEntry[];
}

// ── Per-org mock data ─────────────────────────────────────────────────────────

const ORGS = [
  { id: 0, name: "Organization 1", type: "Institutional Investment", priority: "PRIORITY", time: "24m ago" },
  { id: 1, name: "Organization 2", type: "Logistics & Supply",        priority: "STANDARD", time: "2h ago" },
  { id: 2, name: "Organization 3", type: "Cloud Infrastructure",      priority: "STANDARD", time: "5h ago" },
  { id: 3, name: "Organization 4", type: "Bio-tech Research",         priority: "STANDARD", time: "Yesterday" },
  { id: 4, name: "Organization 5", type: "Financial Services",        priority: "STANDARD", time: "1 day ago" },
  { id: 5, name: "Organization 6", type: "Healthcare",                priority: "STANDARD", time: "2 days ago" },
  { id: 6, name: "Organization 7", type: "Legal Services",            priority: "PRIORITY", time: "3 days ago" },
  { id: 7, name: "Organization 8", type: "Education",                 priority: "STANDARD", time: "4 days ago" },
];

const ORG_DETAILS: Record<number, OrgDetail> = {
  0: {
    name: "Organization 1", submissionId: "ACC-0021-VN",
    submittedBy: "Wilson Fisk", adviser: "John Doe", dueDate: "Apr 14, 2026",
    documents: [
      { name: "Articles of Incorporation",       meta: "PDF · 2.4 MB · Verified",              status: "VALID" },
      { name: "Fiscal Responsibility Statement", meta: "PDF · 1.1 MB · Pending Review",         status: "REVIEWING" },
      { name: "Operational Guidelines v2.4",     meta: "PDF · 5.8 MB · Verification Required",  status: "DISCREPANCY" },
      { name: "Ethics Compliance Charter",       meta: "",                                       status: null },
    ],
  },
  1: {
    name: "Organization 2", submissionId: "ACC-0034-VN",
    submittedBy: "Claire Beaumont", adviser: "Sarah Lin", dueDate: "Apr 18, 2026",
    documents: [
      { name: "Certificate of Registration", meta: "PDF · 1.8 MB · Verified",       status: "VALID" },
      { name: "Financial Audit Report",      meta: "PDF · 3.2 MB · Verified",       status: "VALID" },
      { name: "Governance Charter",          meta: "PDF · 0.9 MB · Pending Review", status: "REVIEWING" },
      { name: "Insurance Certificate",       meta: "",                               status: null },
    ],
  },
  2: {
    name: "Organization 3", submissionId: "ACC-0047-VN",
    submittedBy: "Marcus Webb", adviser: "David Park", dueDate: "Apr 22, 2026",
    documents: [
      { name: "Articles of Incorporation",  meta: "PDF · 2.1 MB · Verified",              status: "VALID" },
      { name: "Cloud Security Compliance",  meta: "PDF · 4.4 MB · Verification Required",  status: "DISCREPANCY" },
      { name: "Data Handling Agreement",    meta: "PDF · 1.3 MB · Pending Review",         status: "REVIEWING" },
      { name: "Director Consent Forms",     meta: "",                                       status: null },
    ],
  },
  3: {
    name: "Organization 4", submissionId: "ACC-0058-VN",
    submittedBy: "Elena Vasquez", adviser: "Tom Nguyen", dueDate: "Apr 28, 2026",
    documents: [
      { name: "Research Ethics Approval",      meta: "PDF · 2.7 MB · Verified",       status: "VALID" },
      { name: "IRB Compliance Certificate",    meta: "PDF · 1.5 MB · Verified",       status: "VALID" },
      { name: "Bio-safety Protocol",           meta: "PDF · 3.9 MB · Pending Review", status: "REVIEWING" },
      { name: "Funding Disclosure Statement",  meta: "",                               status: null },
    ],
  },
  4: {
    name: "Organization 5", submissionId: "ACC-0063-VN",
    submittedBy: "James Hartley", adviser: "Sarah Lin", dueDate: "May 2, 2026",
    documents: [
      { name: "Financial Services Licence",    meta: "PDF · 1.9 MB · Verified",       status: "VALID" },
      { name: "AML Compliance Report",         meta: "PDF · 2.3 MB · Pending Review", status: "REVIEWING" },
      { name: "Director ID Verification",      meta: "PDF · 0.8 MB · Verified",       status: "VALID" },
      { name: "Client Fund Policy",            meta: "",                               status: null },
    ],
  },
  5: {
    name: "Organization 6", submissionId: "ACC-0071-VN",
    submittedBy: "Nina Patel", adviser: "John Doe", dueDate: "May 5, 2026",
    documents: [
      { name: "Healthcare Provider Licence",   meta: "PDF · 3.1 MB · Verified",              status: "VALID" },
      { name: "Privacy Impact Assessment",     meta: "PDF · 2.0 MB · Verification Required",  status: "DISCREPANCY" },
      { name: "Clinical Governance Policy",    meta: "PDF · 1.4 MB · Pending Review",         status: "REVIEWING" },
      { name: "Indemnity Insurance",           meta: "",                                       status: null },
    ],
  },
  6: {
    name: "Organization 7", submissionId: "ACC-0079-VN",
    submittedBy: "Robert Crane", adviser: "David Park", dueDate: "May 8, 2026",
    documents: [
      { name: "Legal Practice Certificate",    meta: "PDF · 1.2 MB · Verified",       status: "VALID" },
      { name: "Professional Indemnity",        meta: "PDF · 0.9 MB · Verified",       status: "VALID" },
      { name: "Conflicts of Interest Policy",  meta: "PDF · 1.6 MB · Pending Review", status: "REVIEWING" },
      { name: "Trust Account Declaration",     meta: "",                               status: null },
    ],
  },
  7: {
    name: "Organization 8", submissionId: "ACC-0085-VN",
    submittedBy: "Anne Buckley", adviser: "Tom Nguyen", dueDate: "May 12, 2026",
    documents: [
      { name: "Education Provider Registration", meta: "PDF · 2.5 MB · Verified",       status: "VALID" },
      { name: "Safeguarding Policy",             meta: "PDF · 1.7 MB · Pending Review", status: "REVIEWING" },
      { name: "Curriculum Framework",            meta: "PDF · 3.3 MB · Verified",       status: "VALID" },
      { name: "Staff Background Checks",         meta: "",                               status: null },
    ],
  },
};

function initialStatuses(orgId: number): Record<string, DocStatus> {
  return Object.fromEntries(ORG_DETAILS[orgId].documents.map((d) => [d.name, d.status]));
}

// ── Status pill ───────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: DocStatus }) {
  if (!status) return null;
  const styles: Record<NonNullable<DocStatus>, string> = {
    VALID:       "border-success/30 text-success bg-success/10",
    REVIEWING:   "border-warning/30 text-warning bg-warning/10",
    DISCREPANCY: "border-destructive/30 text-destructive bg-destructive/10",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {status}
    </span>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface NoteEntry { id: string; text: string; timestamp: string }

export default function AccreditationReviewPage() {
  const [selectedOrg,    setSelectedOrg]    = useState(0);
  const [currentNote,    setCurrentNote]    = useState("");
  const [notes,          setNotes]          = useState<NoteEntry[]>([]);
  const [editingNoteId,  setEditingNoteId]  = useState<string | null>(null);
  const [editingText,    setEditingText]    = useState("");
  const [decision,       setDecision]       = useState<Decision>(null);
  const noteIdRef = useRef(0);

  // Per-document state
  const [docStatuses,    setDocStatuses]    = useState<Record<string, DocStatus>>(() => initialStatuses(0));
  const [docNotes,       setDocNotes]       = useState<Record<string, string>>({});
  const [expandedDoc,    setExpandedDoc]    = useState<string | null>(null);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const detail = ORG_DETAILS[selectedOrg];
  const reviewedCount = detail.documents.filter(
    (d) => docStatuses[d.name] !== d.status
  ).length;
  const canApprove = reviewedCount >= 3;

  function selectOrg(id: number) {
    setSelectedOrg(id);
    setDecision(null);
    setCurrentNote("");
    setNotes([]);
    setEditingNoteId(null);
    setEditingText("");
    setExpandedDoc(null);
    setDocStatuses(initialStatuses(id));
    setDocNotes({});
  }

  const handleAddNote = useCallback(() => {
    if (!currentNote.trim()) return;
    noteIdRef.current += 1;
    setNotes((prev) => [
      ...prev,
      { id: String(noteIdRef.current), text: currentNote.trim(), timestamp: "Just now" },
    ]);
    setCurrentNote("");
  }, [currentNote]);

  function startEdit(note: NoteEntry) {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  }

  function saveEdit(id: string) {
    if (!editingText.trim()) return;
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, text: editingText.trim() } : n));
    setEditingNoteId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingNoteId(null);
    setEditingText("");
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function toggleDoc(name: string) {
    setExpandedDoc((prev) => (prev === name ? null : name));
  }

  function updateDocStatus(name: string, status: NonNullable<DocStatus>) {
    setDocStatuses((prev) => ({ ...prev, [name]: status }));
  }

  function handleDownload(e: React.MouseEvent, name: string) {
    e.stopPropagation();
    setDownloadingDoc(name);
    setTimeout(() => setDownloadingDoc(null), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
      <OnboardingHeader />

      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">

          {/* Page heading */}
          <div>
            <p className="text-sm font-light uppercase tracking-wide" style={{ color: "var(--muted)" }}>
              Accreditation Review
            </p>
            <h1 className="text-4xl font-bold text-foreground leading-none tracking-tight mt-1" style={{ fontFamily: "var(--font-heading)" }}>
              Review Application.
            </h1>
            <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
              Verify organization details and approve or reject the accreditation request.
            </p>
          </div>

          {/* Main card */}
          <div className="bg-background rounded-2xl shadow-sm border border-border">

            {/* ── Review state ──────────────────────────────────────────── */}
            {decision === null && (
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

                {/* Left org list */}
                <div className="border-b lg:border-b-0 lg:border-r border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                      {ORGS.length} Organizations Pending
                    </span>
                  </div>
                  {ORGS.map((org) => {
                    const isSelected = selectedOrg === org.id;
                    return (
                      <div
                        key={org.id}
                        onClick={() => selectOrg(org.id)}
                        className={`px-4 py-4 border-b border-border last:border-0 cursor-pointer transition-colors ${
                          isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>{org.priority}</span>
                          <span className="text-[10px]" style={{ color: "var(--muted)" }}>{org.time}</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mt-1">{org.name}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{org.type}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Right detail panel */}
                <div className="p-6 flex flex-col gap-6">

                  {/* Org header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        {detail.name}
                      </h2>
                      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Submission ID: {detail.submissionId}</p>
                    </div>
                    <div className="w-14 h-14 bg-slate-100 border border-border rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-[10px] italic" style={{ color: "var(--muted)" }}>logo</span>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    {[
                      { label: "Submitted By",      value: detail.submittedBy },
                      { label: "Assigned Adviser",  value: detail.adviser },
                      { label: "Due Date",          value: detail.dueDate },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>{label}</p>
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Documentation checklist */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                      Documentation Checklist ({detail.documents.length})
                    </p>
                    <ul>
                      {detail.documents.map(({ name, meta }) => {
                        const status    = docStatuses[name] ?? null;
                        const isExpanded = expandedDoc === name;
                        const isDownloading = downloadingDoc === name;

                        return (
                          <li key={name} className="border-b border-border last:border-0">
                            {/* Row */}
                            <div
                              className="flex items-center gap-3 py-3 cursor-pointer hover:bg-slate-50/60 transition-colors rounded-sm -mx-1 px-1"
                              onClick={() => toggleDoc(name)}
                            >
                              <div className="w-8 h-8 bg-slate-50 border border-border rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                                📄
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{name}</p>
                                {meta && <p className="text-xs" style={{ color: "var(--muted)" }}>{meta}</p>}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <StatusPill status={status} />
                                <button
                                  type="button"
                                  onClick={(e) => handleDownload(e, name)}
                                  className="text-sm transition-colors hover:text-foreground ml-1"
                                  style={{ color: "var(--muted)" }}
                                  aria-label="Download"
                                  title="Document preview available after deployment"
                                >
                                  {isDownloading ? (
                                    <span className="text-xs" style={{ color: "var(--muted)" }}>Downloading…</span>
                                  ) : "↓"}
                                </button>
                              </div>
                            </div>

                            {/* Expanded review panel */}
                            {isExpanded && (
                              <div
                                className="mx-1 mb-3 p-3 border border-border rounded-[var(--radius)] bg-slate-50/50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
                                  Reviewer Notes
                                </p>
                                <textarea
                                  className="w-full border border-border rounded-[var(--radius)] p-2.5 text-sm resize-none outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background text-foreground placeholder:text-muted"
                                  placeholder="Add notes about this document..."
                                  rows={2}
                                  value={docNotes[name] ?? ""}
                                  onChange={(e) => setDocNotes((prev) => ({ ...prev, [name]: e.target.value }))}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => updateDocStatus(name, "VALID")}
                                    className="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors border-success/30 text-success bg-success/10 hover:bg-success/20"
                                  >
                                    Mark Valid
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDocStatus(name, "REVIEWING")}
                                    className="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors border-warning/30 text-warning bg-warning/10 hover:bg-warning/20"
                                  >
                                    Flag for Review
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateDocStatus(name, "DISCREPANCY")}
                                    className="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/20"
                                  >
                                    Mark Discrepancy
                                  </button>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Internal notes */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
                      System Admin Note
                    </p>
                    <textarea
                      className="w-full border border-border rounded-[var(--radius)] p-3 text-sm resize-none outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background text-foreground placeholder:text-muted"
                      placeholder="Add a note visible to system administrators only..."
                      rows={3}
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                    />
                    <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Visible to Super Admins only
                    </p>
                    {notes.map((n) => (
                      <div key={n.id} className="bg-slate-50 border border-border rounded-[var(--radius)] p-3 mt-2">
                        {editingNoteId === n.id ? (
                          <>
                            <textarea
                              className="w-full border border-border rounded-[var(--radius)] p-2 text-sm resize-none outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-background text-foreground"
                              rows={2}
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                            <div className="flex gap-2 mt-2">
                              <button type="button" className="text-xs font-medium px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors" onClick={() => saveEdit(n.id)}>Save</button>
                              <button type="button" className="text-xs font-medium px-2.5 py-1 rounded-full border border-border transition-colors hover:bg-slate-100" style={{ color: "var(--muted)" }} onClick={cancelEdit}>Cancel</button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm text-foreground">{n.text}</p>
                              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{n.timestamp} · Super Admin</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button type="button" className="text-xs px-2 py-0.5 rounded hover:bg-slate-200 transition-colors" style={{ color: "var(--muted)" }} onClick={() => startEdit(n)}>Edit</button>
                              <button type="button" className="text-xs px-2 py-0.5 rounded hover:bg-destructive/10 text-destructive transition-colors" onClick={() => deleteNote(n.id)}>Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action bar */}
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm transition-colors hover:text-foreground"
                      style={{ color: "var(--muted)" }}
                      onClick={handleAddNote}
                    >
                      Add Internal Note
                    </button>
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => setDecision("rejected")}>
                        Reject
                      </Button>
                      <span title={!canApprove ? "Review all documents before approving" : undefined}>
                        <Button
                          disabled={!canApprove}
                          onClick={() => setDecision("approved")}
                        >
                          Approve Accreditation
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Approved state ────────────────────────────────────────── */}
            {decision === "approved" && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckIcon />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Accreditation Approved
                </h2>
                <p className="text-sm max-w-sm" style={{ color: "var(--muted)" }}>
                  {detail.name} has been approved. The owner will receive an email invitation to
                  complete their organization setup.
                </p>
              </div>
            )}

            {/* ── Rejected state ─────────────────────────────────────────── */}
            {decision === "rejected" && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <XIcon />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Accreditation Rejected
                </h2>
                <p className="text-sm max-w-sm" style={{ color: "var(--muted)" }}>
                  {detail.name} has been notified of the decision.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setDecision(null)}>
                  ← Back to Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
