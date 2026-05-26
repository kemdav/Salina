"use client";

import { useEffect, useState } from "react";
import { getMembers, type Member } from "@/lib/actions/members";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = members.filter((member) => {
    const q = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {members.length} total members
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 w-full pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">
          Loading directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="px-4 py-10 text-center text-sm text-slate-400">
            No members match your search.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-colors hover:bg-slate-50/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {(member.name || member.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <Badge variant="secondary" className="capitalize">
                  {member.role}
                </Badge>
                <span className="text-xs text-slate-400">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
