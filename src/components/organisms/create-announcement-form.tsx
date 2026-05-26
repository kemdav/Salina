"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { createAnnouncement } from "@/lib/actions/announcements";

export function CreateAnnouncementForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const category = formData.get("category") as string;

    try {
      await createAnnouncement({ title, body, category });
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create announcement");
      } else {
        setError("Failed to create announcement");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 mb-8 rounded-2xl border border-border bg-white shadow-sm"
    >
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Post New Announcement
      </h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 rounded bg-red-50">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Announcement Title"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            className="flex w-full h-10 px-3 py-2 text-sm bg-transparent rounded-[var(--radius)] border border-border outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
          >
            <option value="General">General</option>
            <option value="Important">Important</option>
            <option value="Event">Event</option>
            <option value="Reminder">Reminder</option>
          </select>
        </div>

        <div>
          <Label htmlFor="body">Message Body</Label>
          <textarea
            id="body"
            name="body"
            required
            rows={4}
            placeholder="Type your announcement here..."
            className="w-full resize-none rounded-[var(--radius)] border border-border p-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
          ></textarea>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Posting..." : "Post Announcement"}
        </Button>
      </div>
    </form>
  );
}
