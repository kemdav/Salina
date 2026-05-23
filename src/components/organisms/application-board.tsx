"use client";

import { useState, useOptimistic, startTransition } from "react";
import { Button } from "@/components/atoms/button";
import {
  updateApplicantStage,
  updateApplicantDecision,
} from "@/lib/actions/recruitment";
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
  questions?: { id: string; label: string; required: boolean }[];
};

export function ApplicationBoard({
  entryTitle,
  applicants,
  stages = [],
}: {
  entryTitle: string;
  applicants: BoardApplicant[];
  stages?: BoardStage[];
}) {
  const [selectedApplicant, setSelectedApplicant] =
    useState<BoardApplicant | null>(null);

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

  async function handleMoveStage(applicantId: string, newStage: string) {
    startTransition(() => {
      setOptimisticApplicants({ id: applicantId, stage: newStage });
    });
    try {
      await updateApplicantStage(applicantId, newStage);
    } catch {
      alert("Failed to move stage.");
    }
  }

  async function handleDecision(
    applicantId: string,
    status: "approved" | "rejected",
  ) {
    startTransition(() => {
      setOptimisticApplicants({ id: applicantId, status });
    });
    try {
      await updateApplicantDecision(applicantId, status);
    } catch {
      alert("Failed to log decision.");
    }
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
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
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
                    onClick={() =>
                      setSelectedApplicant(
                        selectedApplicant?.id === a.id ? null : a,
                      )
                    }
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
            onClick={() => setSelectedApplicant(null)}
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
                    selectedApplicant.stage === s.id ? "primary" : "ghost"
                  }
                  onClick={() => {
                    handleMoveStage(selectedApplicant.id, s.id);
                    setSelectedApplicant((prev) =>
                      prev ? { ...prev, stage: s.id } : null,
                    );
                  }}
                  className="justify-start"
                >
                  {s.name}
                </Button>
              ))}
            </div>

            {/* Display meeting link depending on the current stage type */}
            {effectiveStages.find(s => s.id === selectedApplicant.stage)?.type === 'interview' && effectiveStages.find(s => s.id === selectedApplicant.stage)?.meetingLink && (
              <div className="pt-4 mt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Interview Link</h3>
                <a 
                  href={effectiveStages.find(s => s.id === selectedApplicant.stage)?.meetingLink}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-50 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 transition"
                >
                  Join Meeting
                </a>
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
