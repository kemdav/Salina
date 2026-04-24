"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";

const ORGS = [
  {
    initials: "NV",
    name: "Nova Dynamics",
    slug: "nova-dynamic-bt3",
    status: "Active",
    created: "Oct 12, 2023",
  },
  {
    initials: "AC",
    name: "Apex Consulting",
    slug: "apex-cons-rqc",
    status: "Pending",
    created: "Nov 04, 2023",
  },
  {
    initials: "ST",
    name: "Stellar Tech",
    slug: "stellar-tech-bbtc",
    status: "Active",
    created: "Nov 18, 2023",
  },
  {
    initials: "LU",
    name: "Lumina Global",
    slug: "lumina-gl",
    status: "Suspended",
    created: "Dec 01, 2023",
  },
  {
    initials: "NX",
    name: "Nexus Core",
    slug: "nexus-core",
    status: "Active",
    created: "Jan 05, 2024",
  },
];

const STATUS_DOT: Record<string, string> = {
  Active: "bg-success",
  Pending: "bg-warning",
  Suspended: "bg-destructive",
};

const STATUS_TEXT: Record<string, string> = {
  Active: "text-success",
  Pending: "text-warning",
  Suspended: "text-destructive",
};

const PAGES = [1, 2, 3, "...", 129];

export default function MembersPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ORGS.filter((org) => {
    const matchesStatus =
      filterStatus === "all" || org.status.toLowerCase() === filterStatus;
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
            Total count: 1,284 registered organizations.
          </p>
        </div>
        <Link
          href="/superadmin/review"
          className="inline-flex items-center gap-2 rounded-(--radius) bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          + New Organization
        </Link>
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

        <Select className="w-full lg:w-48">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-3 text-xs"
          >
            Filter
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-3 text-xs"
          >
            Download
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {["Organization Name", "Slug", "Status", "Created Date", ""].map(
                (col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-500"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No organizations match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((org) => (
                <tr
                  key={org.slug}
                  className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {org.initials}
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
                      className={`flex items-center gap-1.5 font-medium ${STATUS_TEXT[org.status]}`}
                    >
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[org.status]}`}
                      />
                      {org.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {org.created}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                      >
                        Open
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                      >
                        Edit Access
                      </Button>
                      <Button
                        type="button"
                        variant={
                          org.status === "Suspended"
                            ? "secondary"
                            : "destructive"
                        }
                        className="h-8 px-3 text-xs"
                      >
                        {org.status === "Suspended" ? "Reactivate" : "Suspend"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing 1 to 10 of 1,284 organizations
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 items-center justify-center rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50"
          >
            Previous
          </button>
          {PAGES.map((page, i) => (
            <button
              key={i}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-(--radius) text-sm transition-colors ${
                page === 1
                  ? "bg-foreground text-background"
                  : "border border-border bg-white text-foreground hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="flex h-8 items-center justify-center rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
