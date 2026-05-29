"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";
import {
  updateOrganizationStatus,
  type Organization,
} from "@/lib/actions/organizations";

const STATUS_DOT: Record<string, string> = {
  active: "bg-success",
  pending: "bg-warning",
  suspended: "bg-destructive",
};

const STATUS_TEXT: Record<string, string> = {
  active: "text-success",
  pending: "text-warning",
  suspended: "text-destructive",
};

export function OrganizationsManager({
  initialOrganizations,
  isReadOnly = false,
}: {
  initialOrganizations: Organization[];
  isReadOnly?: boolean;
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const [optimisticOrgs, addOptimisticOrg] = useOptimistic(
    initialOrganizations,
    (
      state,
      {
        id,
        status,
      }: { id: string; status: "pending" | "active" | "suspended" },
    ) => state.map((org) => (org.id === id ? { ...org, status } : org)),
  );

  const filtered = optimisticOrgs.filter((org) => {
    const matchesStatus = filterStatus === "all" || org.status === filterStatus;
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (org: Organization) => {
    const newStatus = org.status === "suspended" ? "active" : "suspended";
    startTransition(async () => {
      addOptimisticOrg({ id: org.id, status: newStatus });
      await updateOrganizationStatus(org.id, newStatus);
    });
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Organizations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Total count: {initialOrganizations.length} registered organizations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full lg:max-w-sm"
        />

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full lg:w-48"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {[
                "Organization Name",
                "Slug",
                "Status",
                "Created Date",
                ...(!isReadOnly ? [""] : []),
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
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
                  colSpan={isReadOnly ? 4 : 5}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No organizations match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase">
                        {org.name.substring(0, 2)}
                      </div>
                      <span className="font-medium text-foreground">
                        {org.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {org.slug}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`flex items-center gap-1.5 font-medium ${STATUS_TEXT[org.status] || ""}`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[org.status] || ""}`}
                      />
                      <span className="capitalize">{org.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(org.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  {!isReadOnly && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant={
                            org.status === "suspended"
                              ? "secondary"
                              : "destructive"
                          }
                          className="h-8 px-3 text-xs"
                          onClick={() => handleToggleStatus(org)}
                          disabled={isPending}
                        >
                          {org.status === "suspended" ? "Reactivate" : "Suspend"}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
