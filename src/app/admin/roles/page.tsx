import { getRoles } from "@/lib/actions/roles";
import { RolesManager } from "@/components/organisms/roles-manager";

export default async function AdminRolesPage() {
  const roles = await getRoles();
  
  return <RolesManager initialRoles={roles} />;
}

