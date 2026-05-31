"use client";

import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import {
  assignCustomRole,
  removeMember,
  updateMemberDues,
  updateMemberName,
  updateMemberRole,
  updateMemberStatus,
  updateMemberTags,
  updateSystemRole,
  type Member,
  type Dues,
  type Status,
} from "@/lib/actions/members";
import type { OrganizationRole } from "@/lib/actions/roles";
import { InviteMemberModal } from "@/components/organisms/invite-member-modal";
import { MemberActionsMenu } from "@/components/organisms/member-actions-menu";
import { Select } from "@/components/atoms/drop-down";

const STATUS_CLASS: Record<Status, string> = {
  Active: "rounded-full border-success bg-success text-white",
  Probation: "rounded-full border-warning bg-warning text-white",
  Alumni: "rounded-full border-slate-700 bg-slate-700 text-white",
  Suspended: "rounded-full border-destructive bg-destructive text-white",
};

const DUES_CLASS: Record<Dues, string> = {
  Paid: "rounded-full border-success bg-success text-white",
  Unpaid: "rounded-full border-destructive bg-destructive text-white",
};

export default function MembersTable({
  members,
  roles,
  canAssignRoles,
  canManageSystemRoles,
  canManageMembers = false,
}: {
  members: Member[];
  roles: OrganizationRole[];
  canAssignRoles?: boolean;
  canManageSystemRoles?: boolean;
  canManageMembers?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(Date.now());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filtered = members.filter((member) => {
    const q = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q)
    );
  });

  const handleRoleChange = (membershipId: string, roleId: string) => {
    startTransition(() => {
      assignCustomRole(membershipId, roleId === "none" ? null : roleId, null);
    });
  };

  const handleSystemRoleChange = (membershipId: string, newRole: string) => {
    startTransition(() => {
      updateSystemRole(membershipId, newRole);
    });
  };

  const handleStatusChange = (membershipId: string, currentStatus: Status) => {
    const statuses: Status[] = ["Active", "Probation", "Alumni", "Suspended"];
    const nextStatus =
      statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    startTransition(() => {
      updateMemberStatus(membershipId, nextStatus);
    });
  };

  const handleDuesChange = (membershipId: string, currentDues: Dues) => {
    const nextDues: Dues = currentDues === "Paid" ? "Unpaid" : "Paid";

    startTransition(() => {
      updateMemberDues(membershipId, nextDues);
    });
  };

  const handleExpirationChange = (
    membershipId: string,
    roleId: string,
    value: string,
  ) => {
    let expiresAt = null;

    if (value === "24h") {
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      expiresAt = tomorrow.toISOString();
    } else if (value === "7d") {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      expiresAt = nextWeek.toISOString();
    }

    startTransition(() => {
      assignCustomRole(membershipId, roleId, expiresAt);
    });
  };

  const handleRemove = (membershipId: string, userId: string) => {
    startTransition(() => {
      removeMember(membershipId, userId);
    });
  };

  const handleRename = (
    _membershipId: string,
    userId: string,
    newName: string,
  ) => {
    startTransition(() => {
      updateMemberName(userId, newName);
    });
  };

  const handleRoleEdit = (membershipId: string, role: string) => {
    startTransition(() => {
      updateMemberRole(membershipId, role);
    });
  };

  const handleTags = (membershipId: string, tags: string[]) => {
    startTransition(() => {
      updateMemberTags(membershipId, tags);
    });
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Roster
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {members.length} total members
          </p>
        </div>
        <InviteMemberModal />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-9 w-64"
        />
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full [&_tr:last-child_td:first-child]:rounded-bl-2xl [&_tr:last-child_td:last-child]:rounded-br-2xl">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {[
                "Member",
                "Email",
                "System Role",
                "Custom Role",
                "Status",
                "Dues",
                "Tags",
                "Joined",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500 first:rounded-tl-2xl last:rounded-tr-2xl ${col === "Actions" ? "text-center" : "text-left"}`}
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
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-400 rounded-b-2xl"
                >
                  No members match your search.
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {(member.name || member.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    {canManageSystemRoles &&
                    (member.role === "member" || member.role === "officer") ? (
                      <Select
                        className="h-8 w-auto px-3 py-1 text-xs cursor-pointer shadow-sm"
                        value={member.role}
                        onChange={(event) =>
                          handleSystemRoleChange(member.id, event.target.value)
                        }
                        disabled={isPending}
                      >
                        <option value="member">Member</option>
                        <option value="officer">Officer</option>
                      </Select>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-full capitalize"
                      >
                        {member.role}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {member.role === "owner" || member.role === "admin" ? (
                      <span className="text-xs italic text-slate-400">
                        Full Access
                      </span>
                    ) : canAssignRoles ? (
                      <div className="flex flex-col gap-2">
                        <Select
                          value={member.roleId || "none"}
                          onChange={(event) =>
                            handleRoleChange(member.id, event.target.value)
                          }
                          disabled={isPending}
                          className="h-8 cursor-pointer w-full text-xs"
                        >
                          <option value="none">None</option>
                          {roles
                            .filter((role) => role.is_assignable_to_members)
                            .map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </Select>
                        {member.roleId && (
                          <Select
                            value={
                              member.roleExpiresAt &&
                              new Date(member.roleExpiresAt).getTime() > now
                                ? "temp"
                                : "perm"
                            }
                            onChange={(event) =>
                              handleExpirationChange(
                                member.id,
                                member.roleId!,
                                event.target.value,
                              )
                            }
                            disabled={isPending}
                            className="h-7 w-full cursor-pointer bg-slate-50 text-[10px] text-slate-500"
                          >
                            <option value="perm">Permanent</option>
                            <option value="24h">Expires in 24h</option>
                            <option value="7d">Expires in 7 days</option>
                            {member.roleExpiresAt &&
                              new Date(member.roleExpiresAt).getTime() >
                                now && (
                                <option value="temp">Active (Temporary)</option>
                              )}
                          </Select>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-600">
                        {roles.find((role) => role.id === member.roleId)
                          ?.name || "None"}
                      </span>
                    )}
                    {member.roleExpiresAt &&
                      new Date(member.roleExpiresAt).getTime() <= now && (
                        <div className="mt-1 text-[10px] font-semibold text-red-500">
                          Expired
                        </div>
                      )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleStatusChange(member.id, member.status)
                      }
                      className="focus:outline-none cursor-pointer"
                      disabled={isPending || !canManageMembers}
                    >
                      <Badge className={STATUS_CLASS[member.status]}>
                        {member.status}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDuesChange(member.id, member.dues)}
                      className="focus:outline-none cursor-pointer"
                      disabled={isPending || !canManageMembers}
                    >
                      <Badge className={DUES_CLASS[member.dues]}>
                        {member.dues}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {member.tags.length === 0 ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        member.tags.map((tag) => (
                          <Badge
                            key={`${member.id}-${tag}`}
                            className="rounded-full border-transparent bg-accent/10 text-accent"
                          >
                            {tag}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {canManageMembers ? (
                      <MemberActionsMenu
                        member={member}
                        onRemove={handleRemove}
                        onRename={handleRename}
                        onChangeRole={handleRoleEdit}
                        onUpdateTags={handleTags}
                      />
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
