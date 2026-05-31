import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { getMembers } from "@/lib/actions/members";
import { getRoles } from "@/lib/actions/roles";
import {
  canAssignTemporaryRoles,
  canManageMembers as getCanManageMembers,
} from "@/lib/organization-permissions";
import { getCurrentViewer } from "@/lib/supabase/server";
import MembersTable from "@/app/admin/members/MembersTable";

export default async function OfficerRosterPage() {
  const viewer = await getCurrentViewer();
  const canAssignRoles = canAssignTemporaryRoles(viewer);
  const canManageMembers = getCanManageMembers(viewer);

  if (canAssignRoles || canManageMembers) {
    const members = await getMembers();
    const roles = await getRoles();

    return (
      <MembersTable
        members={members}
        roles={roles}
        canAssignRoles={canAssignRoles}
        canManageSystemRoles={
          viewer
            ? ["admin", "owner", "system_admin"].includes(
                viewer.tenantRole || "",
              ) || viewer.isPlatformAdmin
            : false
        }
        canManageMembers={canManageMembers}
      />
    );
  }

  const members = await getMembers();

  const activeMembers = members.filter(
    (member) => member.status === "Active",
  ).length;
  const onLeave = members.filter((member) =>
    ["Alumni", "Probation", "Suspended"].includes(member.status),
  ).length;
  const officersCount = members.filter(
    (member) => member.role === "officer" || member.tags?.includes("Officer"),
  ).length;

  const rosterStats = [
    {
      label: "Active members",
      value: activeMembers.toString(),
      tone: "emerald",
    },
    { label: "On leave/Probation", value: onLeave.toString(), tone: "amber" },
    { label: "Officers", value: officersCount.toString(), tone: "blue" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="border-transparent bg-[var(--primary)] text-white">
              Roster
            </Badge>
            <div>
              <h2 className="font-[family:var(--font-heading)] text-3xl font-bold tracking-tight text-slate-900">
                Organization members
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Track current members, assignments, and levels in a single data
                table.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {rosterStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${stat.tone === "emerald" ? "bg-emerald-50 text-emerald-700" : stat.tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}
                >
                  Live
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              className="max-w-md"
              placeholder="Search name, role, or tags"
              aria-label="Search roster"
            />
            <Button variant="secondary">Filter roster</Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Dues</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {members.map((member) => (
                  <tr
                    key={member.membership_id}
                    className="align-top transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {member.name || "Unnamed Member"}
                    </td>
                    <td className="px-4 py-4 capitalize text-slate-600">
                      {member.role}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        className={
                          member.status === "Active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <Badge
                        className={
                          member.dues === "Paid"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }
                      >
                        {member.dues}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Button variant="secondary" className="h-8 px-3 text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Roster actions
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>
                • Sync membership changes from onboarding and admin approvals.
              </p>
              <p>• Export a filtered view before officer meetings.</p>
              <p>• Keep attendance history ready for event planning.</p>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
