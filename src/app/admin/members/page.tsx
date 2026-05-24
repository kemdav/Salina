import { getMembers } from "@/lib/actions/members";
import { getRoles } from "@/lib/actions/roles";
import MembersTable from "./MembersTable";

export default async function MembersPage() {
  const members = await getMembers();
  const roles = await getRoles();

  return <MembersTable members={members} roles={roles} />;
}
