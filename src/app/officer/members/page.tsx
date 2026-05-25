import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { getCurrentViewer } from "@/lib/supabase/server";
import { canAssignTemporaryRoles } from "@/lib/organization-permissions";
import { getMembers } from "@/lib/actions/members";
import { getRoles } from "@/lib/actions/roles";
import MembersTable from "@/app/admin/members/MembersTable";

const rosterStats = [
  { label: "Active members", value: "142", tone: "emerald" },
  { label: "On leave", value: "7", tone: "amber" },
  { label: "Committees", value: "5", tone: "blue" },
];

const rosterRows = [
  {
    name: "Excel Santos",
    role: "Human Resources Officer",
    status: "Active",
    committee: "Executive",
    attendance: "94%",
  },
  {
    name: "Camille Reyes",
    role: "Secretary",
    status: "Active",
    committee: "Documentation",
    attendance: "97%",
  },
  {
    name: "Andrei Cruz",
    role: "Treasurer",
    status: "On leave",
    committee: "Finance",
    attendance: "81%",
  },
  {
    name: "Mika Delgado",
    role: "Public Relations",
    status: "Active",
    committee: "Events",
    attendance: "89%",
  },
  {
    name: "Jules Navarro",
    role: "Member",
    status: "Pending",
    committee: "Outreach",
    attendance: "73%",
  },
];

export default async function OfficerRosterPage() {
  const viewer = await getCurrentViewer();
  const canAssignRoles = canAssignTemporaryRoles(viewer);

  if (canAssignRoles) {
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
              )
            : false
        }
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-[var(--primary)] text-white">Roster</Badge>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-[family:var(--font-heading)]">
                Organization members
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Track current members, committee assignments, and attendance
                levels in a single data table.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Export CSV</Button>
            <Button variant="dark">Add member</Button>
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
              placeholder="Search name, role, or committee"
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
                  <th className="px-4 py-3 text-left font-medium">Committee</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Attendance
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rosterRows.map((member) => (
                  <tr key={member.name} className="align-top">
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {member.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{member.role}</td>
                    <td className="px-4 py-4">
                      <Badge
                        className={
                          member.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : member.status === "On leave"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                        }
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {member.committee}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {member.attendance}
                    </td>
                    <td className="px-4 py-4">
                      <Button variant="secondary">View</Button>
                    </td>
                  </tr>
                ))}
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
              <p>• Export a filtered committee view before officer meetings.</p>
              <p>• Keep attendance history ready for event planning.</p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Committee snapshot
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                Documentation team is fully staffed.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                Outreach committee still needs one backup volunteer.
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
