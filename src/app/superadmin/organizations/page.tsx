import { getOrganizations } from "@/lib/actions/organizations";
import { OrganizationsManager } from "@/components/organisms/organizations-manager";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return <OrganizationsManager initialOrganizations={organizations} />;
}
