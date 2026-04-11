import { redirect } from "next/navigation";
import { resolveCurrentTenant } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import React from "react";

function normalizeTenantSlug(value: string | null | undefined) {
  return value?.trim().toLowerCase();
}
function SidebarPlaceholder() {
  return (
    <aside className="w-64 bg-slate-50 border-r border-border p-4 flex flex-col justify-between h-full">
      <div>
        <div className="font-bold text-lg mb-8 px-2 text-foreground">
          App Menu
        </div>
        <nav className="space-y-1">
          <a
            href="#"
            className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
          >
            Applicants
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
          >
            Policies
          </a>
        </nav>
      </div>
      <div>
        <Button variant="secondary" className="w-full">
          Logout
        </Button>
      </div>
    </aside>
  );
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const tenantContext = await resolveCurrentTenant();
  const tenant = tenantContext.tenant;
  const requestedTenantSlug = normalizeTenantSlug(tenantSlug);
  const resolvedTenantSlug = normalizeTenantSlug(tenantContext.tenantSlug);

  if (!tenant) {
    redirect("/"); // make this /login if login page is implemented, or show a 404 not found page if you prefer
  }

  if (
    requestedTenantSlug &&
    resolvedTenantSlug &&
    requestedTenantSlug !== resolvedTenantSlug
  ) {
    redirect(`/${tenantContext.tenantSlug}`);
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <SidebarPlaceholder />
      <main className="flex-1 overflow-auto bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
