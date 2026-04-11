import { redirect } from "next/navigation";
import { resolveCurrentTenant } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import React from "react";

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
  params: _params,
}: {
  children: React.ReactNode;
  params: { tenantSlug: string };
}) {
  const tenantContext = await resolveCurrentTenant();
  const tenant = tenantContext.tenant;

  if (!tenant) {
    redirect("/login");
  }

  // @ts-expect-error - Assuming themeConfig will be added to the Tenant type in lib/supabase/server.ts
  const themeConfig = tenant.themeConfig || {};

  // Injecting CSS variables to cascade branding overrides down the tree
  const style = {
    ...(themeConfig.primary && { "--primary": themeConfig.primary }),
    ...(themeConfig.background && { "--background": themeConfig.background }),
    ...(themeConfig.foreground && { "--foreground": themeConfig.foreground }),
  } as React.CSSProperties;

  return (
    <div className="flex h-screen w-full bg-background" style={style}>
      <SidebarPlaceholder />
      <main className="flex-1 overflow-auto bg-background text-foreground">
        {children}
      </main>
    </div>
  );
}
