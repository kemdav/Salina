"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { AVAILABLE_PERMISSIONS } from "@/lib/organization-permissions";
import {
  createRole,
  updateRole,
  deleteRole,
  type OrganizationRole,
} from "@/lib/actions/roles";

export function RolesManager({
  initialRoles,
}: {
  initialRoles: OrganizationRole[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [optimisticRoles, setOptimisticRoles] = useOptimistic(
    initialRoles,
    (
      state,
      action: {
        type: "add" | "update" | "delete";
        role: Partial<OrganizationRole> & { id: string };
      },
    ) => {
      switch (action.type) {
        case "add":
          return [...state, action.role as OrganizationRole];
        case "update":
          return state.map((r) =>
            r.id === action.role.id ? { ...r, ...action.role } : r,
          );
        case "delete":
          return state.filter((r) => r.id !== action.role.id);
        default:
          return state;
      }
    },
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<OrganizationRole | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  const handleOpenForm = (role?: OrganizationRole) => {
    setError(null);
    if (role) {
      setEditingRole(role);
      setName(role.name);
      setDescription(role.description || "");
      setPermissions(role.permissions || []);
    } else {
      setEditingRole(null);
      setName("");
      setDescription("");
      setPermissions([]);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRole(null);
  };

  const handleTogglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name cannot be empty.");
      return;
    }

    setError(null);
    setIsPending(true);
    const payload = { name, description, permissions };

    try {
      if (editingRole) {
        startTransition(async () => {
          setOptimisticRoles({
            type: "update",
            role: { id: editingRole.id, ...payload },
          });
          await updateRole(editingRole.id, payload);
          handleCloseForm();
        });
      } else {
        const tempId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);

        startTransition(async () => {
          setOptimisticRoles({
            type: "add",
            role: {
              id: tempId,
              ...payload,
              tenant_id: "temp",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              member_count: 0,
            },
          });
          await createRole(payload);
          handleCloseForm();
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    setError(null);
    setIsPending(true);
    try {
      startTransition(async () => {
        setOptimisticRoles({ type: "delete", role: { id } });
        await deleteRole(id);
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to delete role.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Roles
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create custom roles and control what each role can do.
          </p>
        </div>
        <Button className="h-9 px-4 text-sm" onClick={() => handleOpenForm()}>
          + Create Role
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {isFormOpen ? (
        <div className="mb-6 rounded-2xl border border-border bg-white shadow-sm p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {editingRole ? "Edit Role" : "Create New Role"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm md:text-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Content Editor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm md:text-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="What does this role do?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm}
                    className="flex flex-row items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm)}
                      onChange={() => handleTogglePermission(perm)}
                      className="rounded border-slate-300 text-accent focus:ring-accent accent-accent"
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseForm}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : editingRole
                    ? "Save Changes"
                    : "Create Role"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50/50">
                {["Role Name", "Permissions", "Members", "Actions"].map(
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
              {optimisticRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    No custom roles have been created yet.
                  </td>
                </tr>
              ) : (
                optimisticRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {role.name}
                      {role.description && (
                        <p className="text-xs text-slate-500 font-normal mt-0.5">
                          {role.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.length ? (
                          <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">
                            {role.permissions.length} selected
                          </span>
                        ) : (
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {role.member_count || 0} members
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenForm(role);
                          }}
                          className="text-xs text-slate-500 transition-colors hover:text-foreground disabled:opacity-50"
                          disabled={isPending}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(role.id)}
                          className="text-xs text-destructive transition-colors hover:opacity-80 disabled:opacity-50"
                          disabled={isPending || role.member_count! > 0}
                          title={
                            role.member_count! > 0
                              ? "Cannot delete roles with active members"
                              : "Delete role"
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm self-start">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Permission Matrix
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Available capabilities for defining custom organizational roles.
          </p>

          <div className="mt-5 space-y-3">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <div
                key={permission}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm text-foreground">{permission}</span>
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  System
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
