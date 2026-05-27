"use client";

import { useState, useOptimistic, startTransition, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/atoms/button";
import {
  updateApplicantStage,
  updateApplicantDecision,
} from "@/lib/actions/recruitment-client";
import { Input } from "@/components/atoms/input";
import { StatusBadge } from "@/components/atoms/status-badge";
import { FeedbackModal } from "@/components/organisms/feedback-modal";

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
  entryStatus,
}: {
  entryTitle: string;
  applicants: BoardApplicant[];
  stages?: BoardStage[];
  entryId?: string;
  tenantSlug?: string;
  entryStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [selectedApplicant, setSelectedApplicant] =
    useState<BoardApplicant | null>(null);
  const [isSendLinkOpen, setIsSendLinkOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<string | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(stages.length === 0);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    tone: "error" | "warning" | "success" | "info";
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    tone: "info",
    title: "",
    message: "",
  });

  const openModal = (config: Omit<typeof modalConfig, "isOpen">) => {
    setModalConfig({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

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
        openModal({
          tone: "error",
          title: "Move Failed",
          message: "Failed to move stage. Please try again.",
          confirmText: "Okay",
          showCancel: false,
        });
      }
    });
  }

  function handleDecision(
    applicantId: string,
    status: "approved" | "rejected",
  ) {
    openModal({
      tone: "warning",
      title: "Finalize Decision",
      message: `Are you sure you want to mark this applicant as ${status}? This action is permanent and cannot be undone.`,
      confirmText: status === "approved" ? "Yes, Approve" : "Yes, Reject",
      cancelText: "Cancel",
      showCancel: true,
      onConfirm: () => {
        startTransition(async () => {
          setOptimisticApplicants({ id: applicantId, status });
          setSelectedApplicant(prev => prev ? { ...prev, status } : null);
          try {
            await updateApplicantDecision(applicantId, status);
            router.refresh();
          } catch (err) {
            openModal({
              tone: "error",
              title: "Decision Failed",
              message: err instanceof Error ? err.message : "Failed to log decision. Please try again.",
              confirmText: "Okay",
              showCancel: false,
            });
          }
        });
      }
    });
  }

  const effectiveStages = stages;

  // Pre-process applicants per column
  const cols = effectiveStages.map((stage) => ({
    ...stage,
    applicants: filteredApplicants.filter(
      (a) => (a.stage || effectiveStages[0]?.id) === stage.id,
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
            <div className="flex items-center gap-2 mb-1">
              <Button 
                variant="ghost" 
                className="h-6 px-2 text-slate-400 hover:text-slate-600 -ml-2" 
                onClick={() => router.push(isAdmin ? '/admin/recruitment' : '/member')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
              </Button>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Pipeline
              </p>
              {entryStatus && (
                <StatusBadge
                  variant={
                    entryStatus === "published"
                      ? "green"
                      : entryStatus === "closed"
                      ? "red"
                      : "yellow"
                  }
                >
                  {entryStatus}
                </StatusBadge>
              )}
            </div>
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
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push(`/admin/recruitment/${entryId}/settings`)}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </Button>
                )}
                <Button
                  variant="secondary"
                  disabled={entryStatus !== undefined && entryStatus !== "published"}
                  title={entryStatus !== undefined && entryStatus !== "published" ? "Only available when published" : ""}
                  onClick={() => {
                    const url = `${window.location.origin}/${tenantSlug}/apply/${entryId}`;
                    navigator.clipboard.writeText(url);
                    openModal({
                      tone: "success",
                      title: "Link Copied",
                      message: "Public application link copied to clipboard!",
                      confirmText: "Okay",
                      showCancel: false,
                    });
                  }}
                >
                  Copy Link
                </Button>
                <div className="relative">
                  <Button
                    variant="secondary"
                    disabled={entryStatus !== undefined && entryStatus !== "published"}
                    title={entryStatus !== undefined && entryStatus !== "published" ? "Only available when published" : ""}
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
                              const subject = encodeURIComponent(`Invitation to Apply: ${entryTitle}`);
                              const bodyText = `Hi there,\n\nWe're thrilled to invite you to apply for the ${entryTitle} role!\n\nOur team is looking forward to learning more about your background and interests. To get started, please complete your application using the secure link below:\n\n${url}\n\nIf you have any questions, feel free to reply directly to this email.\n\nBest regards,\nThe Recruitment Team`;
                              const body = encodeURIComponent(bodyText);
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
                              const subject = encodeURIComponent(`Invitation to Apply: ${entryTitle}`);
                              const bodyText = `Hi there,\n\nWe're thrilled to invite you to apply for the ${entryTitle} role!\n\nOur team is looking forward to learning more about your background and interests. To get started, please complete your application using the secure link below:\n\n${url}\n\nIf you have any questions, feel free to reply directly to this email.\n\nBest regards,\nThe Recruitment Team`;
                              const body = encodeURIComponent(bodyText);
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
                              const subject = encodeURIComponent(`Invitation to Apply: ${entryTitle}`);
                              const bodyText = `Hi there,\n\nWe're thrilled to invite you to apply for the ${entryTitle} role!\n\nOur team is looking forward to learning more about your background and interests. To get started, please complete your application using the secure link below:\n\n${url}\n\nIf you have any questions, feel free to reply directly to this email.\n\nBest regards,\nThe Recruitment Team`;
                              const body = encodeURIComponent(bodyText);
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
        {stages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-slate-200 rounded-3xl bg-slate-50/50">
            <svg
              className="w-12 h-12 text-slate-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800">Pipeline not configured</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md text-center">
              {isAdmin 
                ? "This recruitment cycle has no stages configured. Please head to settings to design your pipeline."
                : "This recruitment cycle has no stages configured. Please contact an administrator to set up the pipeline."}
            </p>
            {isAdmin && entryId && (
              <Button
                className="mt-4"
                onClick={() => router.push(`/admin/recruitment/${entryId}/settings`)}
              >
                Go to Settings
              </Button>
            )}
          </div>
        ) : (
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
        )}
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
            {selectedApplicant.status === "approved" || selectedApplicant.status === "rejected" ? (
              <p className="text-sm text-slate-500 italic">This application has been finalized.</p>
            ) : (
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
            )}

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
              {selectedApplicant.status === "approved" ? (
                <div className="rounded-xl bg-emerald-50 p-4 text-center border border-emerald-100">
                  <p className="text-sm font-bold text-emerald-700">Applicant Approved</p>
                  <p className="text-xs text-emerald-600 mt-1">They have been added to the organization members.</p>
                </div>
              ) : selectedApplicant.status === "rejected" ? (
                <div className="rounded-xl bg-rose-50 p-4 text-center border border-rose-100">
                  <p className="text-sm font-bold text-rose-700">Applicant Rejected</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    onClick={() => handleDecision(selectedApplicant.id, "approved")}
                  >
                    Approve Applicant
                  </Button>
                  <Button
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                    onClick={() => handleDecision(selectedApplicant.id, "rejected")}
                  >
                    Reject Applicant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      <FeedbackModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        tone={modalConfig.tone}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showCancel={modalConfig.showCancel}
        onConfirm={modalConfig.onConfirm}
      />

      <FeedbackModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        tone="warning"
        title="Pipeline Setup Required"
        message={
          isAdmin
            ? "This recruitment cycle has no stages configured. You need to set up the pipeline first in settings."
            : "This recruitment cycle has no stages configured. Please contact an administrator to set up the pipeline."
        }
        confirmText={isAdmin ? "Go to Settings" : "Okay"}
        showCancel={isAdmin}
        onConfirm={() => {
          if (isAdmin && entryId) {
            router.push(`/admin/recruitment/${entryId}/settings`);
          }
        }}
      />
    </div>
  );
}
