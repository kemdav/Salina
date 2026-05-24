import { getMembers } from "@/lib/actions/members";
import { getRoles } from "@/lib/actions/roles";
import { getCurrentViewer } from "@/lib/supabase/server";
import { canAssignTemporaryRoles } from "@/lib/organization-permissions";
import MembersTable from "./MembersTable";

export default async function MembersPage() {
  const members = await getMembers();
  const roles = await getRoles();
  const viewer = await getCurrentViewer();
  const canAssignRoles = canAssignTemporaryRoles(viewer);

  return (
    <MembersTable
      members={members}
      roles={roles}
      canAssignRoles={canAssignRoles}
    />
  );
}
