"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/drop-down";
import { getAdvisers, approveAdviser, rejectAdviser, type Adviser } from "@/lib/actions/advisers";

export default function AdvisersPage() {
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [advisers, setAdvisers] = useState<Adviser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    startTransition(() => {
      getAdvisers({
        status: filterStatus,
        search: searchQuery,
        page,
        limit,
      }).then(({ data, count }) => {
        setAdvisers(data);
        setTotalCount(count);
      }).catch(err => {
        console.error(err);
      });
    });
  }, [filterStatus, searchQuery, page]);

  const handleApprove = async (id: string) => {
    try {
      await approveAdviser(id);
      // Refresh list
      const { data, count } = await getAdvisers({ status: filterStatus, search: searchQuery, page, limit });
      setAdvisers(data);
      setTotalCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAdviser(id);
      // Refresh list
      const { data, count } = await getAdvisers({ status: filterStatus, search: searchQuery, page, limit });
      setAdvisers(data);
      setTotalCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Adviser Verification
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review submitted advisers and approve or reject access across the
          platform.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <Select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="w-full lg:w-48"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </Select>

        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          className="w-full lg:max-w-sm"
        />

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-3 text-xs"
          >
            Export
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-9 px-3 text-xs"
          >
            Bulk Review
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-slate-50/50">
              {[
                "Adviser Name",
                "Email",
                "Organization",
                "Submitted",
                "Status",
                "Actions",
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
          <tbody className={isPending ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {advisers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No advisers match your filters.
                </td>
              </tr>
            ) : (
              advisers.map((adviser) => (
                <tr
                  key={adviser.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent uppercase">
                        {adviser.name.substring(0, 2)}
                      </div>
                      <span className="font-medium text-foreground">
                        {adviser.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {adviser.email}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {adviser.organization_name}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(adviser.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium uppercase
                      ${adviser.status === 'pending' ? 'border-warning/30 bg-warning/10 text-warning' : 
                        adviser.status === 'approved' ? 'border-success/30 bg-success/10 text-success' : 
                        'border-destructive/30 bg-destructive/10 text-destructive'}`}>
                      {adviser.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                      >
                        View
                      </Button>
                      {adviser.status === "pending" && (
                        <>
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleApprove(adviser.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleReject(adviser.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
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
          Showing {advisers.length > 0 ? (page - 1) * limit + 1 : 0}-
          {Math.min(page * limit, totalCount)} of {totalCount} pending applications
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex h-8 items-center justify-center rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-(--radius) text-sm transition-colors ${
                page === p
                  ? "bg-foreground text-background"
                  : "border border-border bg-white text-foreground hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="flex h-8 items-center justify-center rounded-(--radius) border border-border bg-white px-3 text-sm text-foreground transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
