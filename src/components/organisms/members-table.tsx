"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import {
  Member,
  updateMemberStatus,
  updateMemberDues,
  removeMember,
  updateMemberRole,
  updateMemberTags,
  updateMemberName,
} from "@/lib/actions/members";
import { MemberActionsMenu } from "@/components/organisms/member-actions-menu";
import { Select } from "@/components/atoms/drop-down";

const STATUS_CLASS: Record<string, string> = {
  Active: "rounded-full bg-success text-white border-success",
  Probation: "rounded-full bg-warning text-white border-warning",
  Alumni: "rounded-full bg-slate-700 text-white border-slate-700",
  Suspended: "rounded-full bg-destructive text-white border-destructive",
};

const DUES_CLASS: Record<string, string> = {
  Paid: "rounded-full bg-success text-white border-success",
  Unpaid: "rounded-full bg-destructive text-white border-destructive",
};

const ROLE_CLASS: Record<string, string> = {
  owner: "!bg-indigo-100 !text-indigo-700 border-transparent",
  admin: "!bg-purple-100 !text-purple-700 border-transparent",
  officer: "!bg-blue-100 !text-blue-700 border-transparent",
  member: "!bg-slate-100 !text-slate-700 border-transparent",
  viewer: "!bg-gray-100 !text-gray-700 border-transparent",
};

export function MembersTable({ initialMembers }: { initialMembers: Member[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterTag, setFilterTag] = useState("All Tags");
  const [, startTransition] = useTransition();
  type Action =
    | { type: "status" | "dues" | "role" | "name"; id: string; payload: string }
    | { type: "tags"; id: string; payload: string[] }
    | { type: "remove"; id: string };

  const [optimisticMembers, setOptimisticMembers] = useOptimistic(
    initialMembers,
    (state, action: Action) => {
      switch (action.type) {
        case "status":
        case "dues":
        case "role":
        case "name":
          return state.map((m) =>
            m.membership_id === action.id
              ? { ...m, [action.type]: action.payload }
              : m,
          );
        case "tags":
          return state.map((m) =>
            m.membership_id === action.id ? { ...m, tags: action.payload } : m,
          );
        case "remove":
          return state.filter((m) => m.membership_id !== action.id);
        default:
          return state;
      }
    },
  );

  const filtered = optimisticMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "All Status" || m.status === filterStatus;
    const matchesTag =
      filterTag === "All Tags" ||
      (filterTag === "Paid" && m.dues === "Paid") ||
      (filterTag === "Unpaid" && m.dues === "Unpaid") ||
      (filterTag !== "Paid" &&
        filterTag !== "Unpaid" &&
        m.tags.includes(filterTag));
    return matchesSearch && matchesStatus && matchesTag;
  });

  const handleStatusChange = (id: string, currentStatus: string) => {
    const statuses = ["Active", "Probation", "Alumni", "Suspended"];
    const nextStatus = statuses[
      (statuses.indexOf(currentStatus) + 1) % statuses.length
    ] as import("@/lib/actions/members").Status;
    startTransition(async () => {
      setOptimisticMembers({ type: "status", id, payload: nextStatus });
      await updateMemberStatus(id, nextStatus);
    });
  };

  const handleDuesChange = (id: string, currentDues: string) => {
    const nextDues = currentDues === "Paid" ? "Unpaid" : "Paid";
    startTransition(async () => {
      setOptimisticMembers({ type: "dues", id, payload: nextDues });
      await updateMemberDues(id, nextDues);
    });
  };

  const handleRemove = (id: string, userId: string) => {
    startTransition(async () => {
      setOptimisticMembers({ type: "remove", id });
      await removeMember(id, userId);
    });
  };

  const handleRename = (id: string, userId: string, newName: string) => {
    startTransition(async () => {
      setOptimisticMembers({ type: "name", id, payload: newName });
      await updateMemberName(userId, newName);
    });
  };

  const handleRole = (id: string, role: string) => {
    startTransition(async () => {
      setOptimisticMembers({ type: "role", id, payload: role });
      await updateMemberRole(id, role);
    });
  };

  const handleTags = (id: string, tags: string[]) => {
    startTransition(async () => {
      setOptimisticMembers({ type: "tags", id, payload: tags });
      await updateMemberTags(id, tags);
    });
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex items-center gap-3">
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-64"
        />

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 cursor-pointer w-auto px-3"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Probation</option>
          <option>Alumni</option>
          <option>Suspended</option>
        </Select>

        <Select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="h-9 cursor-pointer w-auto px-3"
        >
          <option>All Tags</option>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Officer</option>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {[
                "Member",
                "Email",
                "Role",
                "Status",
                "Dues",
                "Tags",
                "Joined",
                "Actions",
              ].map((col, i, arr) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500 ${col === "Actions" ? "text-center" : "text-left"} ${i === 0 ? "rounded-tl-2xl" : ""} ${i === arr.length - 1 ? "rounded-tr-2xl" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No members match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((member) => {
                const initials = (member.name || member.email || "UU")
                  .slice(0, 2)
                  .toUpperCase();
                const joined = new Date(member.joined_at).toLocaleDateString(
                  "en-US",
                  { month: "short", year: "numeric" },
                );
                return (
                  <tr
                    key={member.membership_id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60 [&:last-child>td:first-child]:rounded-bl-2xl [&:last-child>td:last-child]:rounded-br-2xl"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials}
                        </div>
                        <span className="font-medium text-foreground">
                          {member.name || "Unnamed Member"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {member.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`capitalize ${ROLE_CLASS[(member.role || "").toLowerCase()] || ROLE_CLASS.member}`}
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            member.membership_id,
                            member.status,
                          )
                        }
                        className="focus:outline-none cursor-pointer"
                      >
                        <Badge
                          className={
                            STATUS_CLASS[member.status] || STATUS_CLASS.Active
                          }
                        >
                          {member.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleDuesChange(member.membership_id, member.dues)
                        }
                        className="focus:outline-none cursor-pointer"
                      >
                        <Badge
                          className={
                            DUES_CLASS[member.dues] || DUES_CLASS.Unpaid
                          }
                        >
                          {member.dues}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {member.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="rounded-full bg-accent/10 text-accent border-transparent"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {joined}
                    </td>
                    <td className="px-4 py-3">
                      <MemberActionsMenu
                        member={member}
                        onRemove={handleRemove}
                        onRename={handleRename}
                        onChangeRole={handleRole}
                        onUpdateTags={handleTags}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
