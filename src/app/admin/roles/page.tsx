"use client";

import { Button } from "@/components/atoms/button";

interface RoleRow {
  name: string;
  permission: string;
  members: number;
}

const ROLES: RoleRow[] = [
  { name: "Officer", permission: "Full Access", members: 8 },
  { name: "Human Resources", permission: "Partial", members: 3 },
  { name: "Organizer", permission: "Events only", members: 5 },
];

const PERMISSIONS = [
  "Dashboard access",
  "Member roster edits",
  "Recruitment reviews",
  "Event management",
  "Announcement posting",
  "Settings access",
];

export default function AdminRolesPage() {
  const handleOpenForm = () => {
    console.log("Create role button clicked");
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
        <Button className="h-9 px-4 text-sm" onClick={handleOpenForm}>
          + Create Role
        </Button>
      </div>

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
              {ROLES.map((role) => (
                <tr
                  key={role.name}
                  className="border-b border-border last:border-0 transition-colors hover:bg-slate-50/60"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {role.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      {role.permission}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {role.members} members
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-xs text-slate-500 transition-colors hover:text-foreground"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs text-destructive transition-colors hover:opacity-80"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Permission Matrix
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Track the capabilities granted to each role before changes are
            saved.
          </p>

          <div className="mt-5 space-y-3">
            {PERMISSIONS.map((permission) => (
              <div
                key={permission}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm text-foreground">{permission}</span>
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Enabled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
