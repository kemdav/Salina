"use client";

import { useState, useOptimistic, startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/atoms/button";
import {
  updateApplicantStage,
  updateApplicantDecision,
} from "@/lib/actions/recruitment-client";
import { Input } from "@/components/atoms/input";

export type BoardApplicant = {
  id: string;
  name: string;
  email: string;
  stage: string;
  status: string;
  created_at: string;
};

export type BoardStage = {
  id: string;
  name: string;
  type: string;
  meetingLink?: string;
  interviewDate?: string;
  interviewTime?: string;
  questions?: { id: string; label: string; required: boolean }[];
};

export function ApplicationBoard({
  entryTitle,
  applicants,
  stages = [],
  entryId,
  tenantSlug,
}: {
  entryTitle: string;
  applicants: BoardApplicant[];
  stages?: BoardStage[];
  entryId?: string;
  tenantSlug?: string;
}) {
  const router = useRouter();
  const [selectedApplicant, setSelectedApplicant] =
    useState<BoardApplicant | null>(null);
  const [isSendLinkOpen, setIsSendLinkOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);

  useEffect(() => {
    if (!entryId) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'temporary_applicants',
          filter: `recruitment_entry_id=eq.${entryId}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entryId, router]);

  const [optimisticApplicants, setOptimisticApplicants] = useOptimistic(
    applicants,
    (
      state,
      { id, stage, status }: { id: string; stage?: string; status?: string },
    ) =>
      state.map((app) =>
        app.id === id
          ? { ...app, ...(stage && { stage }), ...(status && { status }) }
          : app,
      ),
  );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = optimisticApplicants.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleMoveStage(applicantId: string, newStage: string) {
    startTransition(async () => {
      setOptimisticApplicants({ id: applicantId, stage: newStage });
      try {
        await updateApplicantStage(applicantId, newStage);
        router.refresh();
      } catch {
        alert("Failed to move stage.");
      }
    });
  }

  function handleDecision(
    applicantId: string,
    status: "approved" | "rejected",
  ) {
    startTransition(async () => {
      setOptimisticApplicants({ id: applicantId, status });
      try {
        await updateApplicantDecision(applicantId, status);
        router.refresh();
      } catch {
        alert("Failed to log decision.");
      }
    });
  }

  const effectiveStages = stages.length > 0 
    ? stages 
    : [
        { id: "application", name: "Application", type: "form" },
        { id: "screening", name: "Screening", type: "form" },
        { id: "interview", name: "Interview", type: "interview" },
        { id: "deliberation", name: "Deliberation", type: "deliberation" },
      ];

  // Pre-process applicants per column
  const cols = effectiveStages.map((stage) => ({
    ...stage,
    applicants: filteredApplicants.filter(
      (a) => (a.stage || effectiveStages[0].id) === stage.id,
    ),
  }));

  return (
    <div
      className="flex -m-6 sm:-m-8 min-h-[calc(100vh-4rem)]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Kanban area */}
      <div className="min-w-0 flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Pipeline
            </p>
            <h1
              className="text-3xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {entryTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            {entryId && tenantSlug && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const url = `${window.location.origin}/${tenantSlug}/apply/${entryId}`;
                    navigator.clipboard.writeText(url);
                    alert("Public application link copied!");
                  }}
                >
                  Copy Link
                </Button>
                <div className="relative">
                  <Button
                    variant="secondary"
                    onClick={() => setIsSendLinkOpen(!isSendLinkOpen)}
                  >
                    Send Link
                  </Button>
                  {isSendLinkOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsSendLinkOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col py-1">
                          <button
                            className="block px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => {
                              const url = `${window.location.origin}/${tenantSlug}/apply/${entryId}`;
                              const subject = encodeURIComponent(`Apply to ${entryTitle}`);
                              const body = encodeURIComponent(`Please use this link to apply:\n\n${url}`);
                              window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
                              setIsSendLinkOpen(false);
                            }}
                          >
                            Send via Gmail
                          </button>
                          <button
                            className="block px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => {
                              const url = `${window.location.origin}/${tenantSlug}/apply/${entryId}`;
                              const subject = encodeURIComponent(`Apply to ${entryTitle}`);
                              const body = encodeURIComponent(`Please use this link to apply:\n\n${url}`);
                              window.open(`https://outlook.live.com/mail/0/deeplink/compose?subject=${subject}&body=${body}`, '_blank');
                              setIsSendLinkOpen(false);
                            }}
                          >
                            Send via Outlook
                          </button>
                          <button
                            className="block px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            onClick={() => {
                              const url = `${window.location.origin}/${tenantSlug}/apply/${entryId}`;
                              const subject = encodeURIComponent(`Apply to ${entryTitle}`);
                              const body = encodeURIComponent(`Please use this link to apply:\n\n${url}`);
                              window.location.href = `mailto:?subject=${subject}&body=${body}`;
                              setIsSendLinkOpen(false);
                            }}
                          >
                            Default Mail App
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columns grid view */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {cols.map((col) => (
            <div
              key={col.id}
              className="w-80 shrink-0 rounded-2xl border border-border bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {col.name}
                </span>
                <span className="rounded-full border border-border bg-white px-2 py-0.5 text-xs text-slate-500">
                  {col.applicants.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[500px]">
                {col.applicants.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setSelectedApplicant(
                        selectedApplicant?.id === a.id ? null : a,
                      );
                      setPendingStage(null);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-colors hover:border-primary/30 ${selectedApplicant?.id === a.id ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "border-border bg-white"}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {a.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {a.name}
                      </span>
                    </div>
                    <p className="mb-2 text-xs text-slate-500 truncate">
                      {a.email}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedApplicant && (
        <aside className="w-80 shrink-0 border-l border-border bg-white p-6 shadow-xl z-10 flex flex-col overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              setSelectedApplicant(null);
              setPendingStage(null);
            }}
            className="mb-4 self-end text-xs text-slate-400 transition-colors hover:text-foreground"
          >
            ✕ Close
          </button>

          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {selectedApplicant.name.slice(0, 2).toUpperCase()}
            </div>
            <h2
              className="text-lg font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {selectedApplicant.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {selectedApplicant.email}
            </p>
          </div>

          <div className="mb-6 space-y-3 rounded-xl border border-border p-4 bg-slate-50">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Status
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {selectedApplicant.status}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Applied
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {new Date(selectedApplicant.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Move to Stage</h3>
            <div className="flex flex-col gap-2">
              {effectiveStages.map((s) => (
                <Button
                  key={s.id}
                  variant={
                    (pendingStage || selectedApplicant.stage) === s.id ? "primary" : "ghost"
                  }
                  onClick={() => {
                    if (selectedApplicant.stage !== s.id) {
                      setPendingStage(s.id);
                    }
                  }}
                  className="justify-start"
                >
                  {s.name}
                </Button>
              ))}
            </div>

            {pendingStage && (
              <div className="mt-3 p-4 border border-indigo-100 rounded-xl bg-indigo-50/50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-medium text-slate-800">
                  Move to <span className="font-bold">{effectiveStages.find(s => s.id === pendingStage)?.name}</span>?
                </p>
                <p className="text-xs text-slate-500">
                  This will notify the applicant later.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setPendingStage(null)} 
                    variant="ghost" 
                    className="flex-1 bg-white border border-slate-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      handleMoveStage(selectedApplicant.id, pendingStage);
                      setSelectedApplicant(prev => prev ? { ...prev, stage: pendingStage } : null);
                      setPendingStage(null);
                    }} 
                    variant="dark" 
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}

            {/* Display meeting link depending on the current stage type */}
            {effectiveStages.find(s => s.id === selectedApplicant.stage)?.type === 'interview' && (
              <div className="pt-4 mt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Interview Details</h3>
                {(() => {
                  const s = effectiveStages.find(s => s.id === selectedApplicant.stage);
                  return (
                    <div className="space-y-3">
                      {(s?.interviewDate || s?.interviewTime) && (
                        <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 text-sm">
                          {s?.interviewDate && (
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-500 font-medium">Date:</span>
                              <span className="text-slate-800 font-semibold">{s.interviewDate}</span>
                            </div>
                          )}
                          {s?.interviewTime && (
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Time:</span>
                              <span className="text-slate-800 font-semibold">
                                {(() => {
                                  try {
                                    const [hours, minutes] = s.interviewTime.split(':');
                                    const h = parseInt(hours, 10);
                                    const ampm = h >= 12 ? 'PM' : 'AM';
                                    const h12 = h % 12 || 12;
                                    return `${h12}:${minutes} ${ampm}`;
                                  } catch {
                                    return s.interviewTime;
                                  }
                                })()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {s?.meetingLink && (
                        <a 
                          href={s.meetingLink}
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-50 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                        >
                          Join Meeting
                        </a>
                      )}
                      
                      {!s?.meetingLink && !s?.interviewDate && !s?.interviewTime && (
                        <p className="text-sm text-slate-500 italic">No interview details configured.</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="pt-4 mt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-3">
                Final Decision
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-success hover:bg-success/90 text-white"
                  onClick={() => {
                    handleDecision(selectedApplicant.id, "approved");
                    setSelectedApplicant((prev) =>
                      prev ? { ...prev, status: "approved" } : null,
                    );
                  }}
                  disabled={selectedApplicant.status === "approved"}
                >
                  Approve Applicant
                </Button>
                <Button
                  className="w-full bg-destructive hover:bg-destructive/90 text-white"
                  onClick={() => {
                    handleDecision(selectedApplicant.id, "rejected");
                    setSelectedApplicant((prev) =>
                      prev ? { ...prev, status: "rejected" } : null,
                    );
                  }}
                  disabled={selectedApplicant.status === "rejected"}
                >
                  Reject Applicant
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
