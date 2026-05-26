"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at: string;
  author: {
    id: string;
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
    };
  };
  acknowledgmentCount: number;
  hasAcknowledged: boolean;
}

interface AnnouncementsBoardProps {
  announcements: Announcement[];
  onAcknowledge: (id: string) => Promise<unknown>;
  isOfficerOrAdmin: boolean;
}

export function AnnouncementsBoard({
  announcements,
  onAcknowledge,
  isOfficerOrAdmin,
}: AnnouncementsBoardProps) {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleAcknowledge = async (id: string) => {
    setLoadingIds((prev) => new Set(prev).add(id));
    try {
      await onAcknowledge(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-2xl border-border bg-white shadow-sm">
        <p className="text-sm text-slate-500">No official announcements yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => {
        const authorName =
          announcement.author.raw_user_meta_data?.full_name ||
          announcement.author.email;
        const dateStr = new Date(announcement.created_at).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

        return (
          <div
            key={announcement.id}
            className={`flex flex-col p-6 border rounded-2xl shadow-sm transition-colors ${
              announcement.hasAcknowledged
                ? "bg-white border-border"
                : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      announcement.category === "Important"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {announcement.category}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    Posted on {dateStr} by {authorName}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {announcement.title}
                </h3>
              </div>
              {isOfficerOrAdmin && (
                <div className="flex flex-col items-end text-sm">
                  <span className="font-semibold text-foreground">
                    {announcement.acknowledgmentCount}
                  </span>
                  <span className="text-xs text-slate-500">
                    Acknowledgments
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {announcement.body}
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              {announcement.hasAcknowledged ? (
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Acknowledged
                </div>
              ) : (
                <Button
                  onClick={() => handleAcknowledge(announcement.id)}
                  disabled={loadingIds.has(announcement.id)}
                >
                  {loadingIds.has(announcement.id)
                    ? "Acknowledging..."
                    : "Acknowledge"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
