"use client";

import { useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

type CreateRecruitmentCycleModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function CreateRecruitmentCycleModal({
  open,
  onClose,
  onSubmit,
}: CreateRecruitmentCycleModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-cycle-title-heading"
        className="relative flex w-full max-w-md flex-col rounded-2xl border border-border bg-white shadow-2xl"
      >
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="p-6 pb-0">
            <h2
              id="create-cycle-title-heading"
              className="mb-4 text-xl font-bold"
            >
              Create New Recruitment Cycle
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-cycle-title">Title</Label>
                <Input
                  id="create-cycle-title"
                  name="title"
                  required
                  autoFocus
                  placeholder="e.g. Spring 2026 Hiring"
                />
              </div>
              <div>
                <Label htmlFor="create-cycle-description">Description</Label>
                <Input
                  id="create-cycle-description"
                  name="description"
                  placeholder="Brief details about this cycle"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 p-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Cycle</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
