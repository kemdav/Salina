import { getOrganizations } from "@/lib/actions/organizations";
import { OrganizationsManager } from "@/components/organisms/organizations-manager";

export const dynamic = "force-dynamic";

export default async function AdviserOrganizationsPage() {
  const organizations = await getOrganizations();

  return <OrganizationsManager initialOrganizations={organizations} isReadOnly={true} />;
}
