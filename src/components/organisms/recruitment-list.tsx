"use client";

import { useOptimistic, useState, startTransition } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  createRecruitmentEntry,
  updateRecruitmentEntry,
} from "@/lib/actions/recruitment";
import Link from "next/link";

type RecruitmentEntry = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
};

export function RecruitmentList({ entries }: { entries: RecruitmentEntry[] }) {
  const [optimisticEntries, dispatchOptimistic] = useOptimistic(
    entries,
    (state, action: { type: "add" | "update"; payload: RecruitmentEntry }) => {
      if (action.type === "add") {
        return [action.payload, ...state];
      }
      if (action.type === "update") {
        return state.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e,
        );
      }
      return state;
    },
  );

  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEntries = optimisticEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleCreate(formData: FormData) {
    const title = formData.get("title") as string;
    const description = (formData.get("description") ?? "").toString();

    if (!title) return;

    const newEntry = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "draft",
      created_at: new Date().toISOString(),
    };

    // Optimistically add
    startTransition(() => {
      dispatchOptimistic({ type: "add", payload: newEntry });
    });

    setIsCreating(false);

    try {
      // Call server
      await createRecruitmentEntry({ title, description, status: "draft" });
    } catch {
      alert("Failed to create entry.");
    }
  }

  async function handleStatusChange(
    entry: RecruitmentEntry,
    newStatus: string,
  ) {
    startTransition(() => {
      dispatchOptimistic({
        type: "update",
        payload: { ...entry, status: newStatus },
      });
    });
    try {
      await updateRecruitmentEntry({ id: entry.id, status: newStatus });
    } catch {
      alert("Failed to update status.");
    }
  }

  return (
    <div
      className="mx-auto max-w-4xl p-6 sm:p-8"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-3xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Recruitment Cycles
        </h1>
        <Button 
          onClick={() => {
            console.log("Button clicked!");
            setIsCreating((prev) => !prev);
          }}
        >
          {isCreating ? "Cancel" : "+ New Cycle"}
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <Input
          placeholder="Search cycles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="statusFilter" className="text-sm text-slate-500">
            Filter:
          </Label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {isCreating && (
        <form
          action={handleCreate}
          className="mb-8 rounded-2xl border border-border bg-slate-50 p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">
            Create New Recruitment Cycle
          </h2>
          <div className="mb-4 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Spring 2026 Hiring"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Brief details about this cycle"
              />
            </div>
          </div>
          <Button type="submit">Create Cycle</Button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/30"
          >
            <div>
              <div className="mb-2 flex items-center justify-between">
                <select
                  value={entry.status}
                  onChange={(e) => handleStatusChange(entry, e.target.value)}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase cursor-pointer border-none outline-none ${
                    entry.status === "published"
                      ? "bg-success/10 text-success"
                      : entry.status === "closed"
                        ? "bg-slate-100 text-slate-500"
                        : entry.status === "paused"
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-warning/10 text-warning"
                  }`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
                <span className="text-xs text-slate-500">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">
                {entry.title}
              </h3>
              {entry.description && (
                <p className="mb-4 text-sm text-slate-600 line-clamp-2">
                  {entry.description}
                </p>
              )}
            </div>

            <Link
              href={`/admin/recruitment/${entry.id}`}
              className="mt-4 block w-full rounded-lg bg-slate-100 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View Pipeline
            </Link>
          </div>
        ))}

        {filteredEntries.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No recruitment cycles found.
          </div>
        )}
      </div>
    </div>
  );
}
