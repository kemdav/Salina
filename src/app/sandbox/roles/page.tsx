import { createClient } from "@supabase/supabase-js";

// This page runs on the server and fetches roles using the admin client, bypassing RLS and login.
export default async function TestRolesPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return (
      <div className="p-8">
        <h1>Missing Supabase credentials</h1>
        <p>
          Ensure Next.js has access to NEXT_PUBLIC_SUPABASE_URL and
          SUPABASE_SERVICE_ROLE_KEY.
        </p>
      </div>
    );
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: roles, error: rolesError } = await client
    .from("organization_roles")
    .select("*");

  const { data: memberships, error: membershipsError } = await client
    .from("organization_memberships")
    .select("*");

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Organization Roles</h1>
        {rolesError ? (
          <p className="text-red-500">Error: {rolesError.message}</p>
        ) : (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(roles, null, 2)}
          </pre>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Organization Memberships</h1>
        {membershipsError ? (
          <p className="text-red-500">Error: {membershipsError.message}</p>
        ) : (
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(memberships, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
