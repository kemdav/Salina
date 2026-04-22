import { redirect } from "next/navigation";

import { Button } from "@/components/atoms/button";
import { getCurrentViewer, resolveCurrentTenant } from "@/lib/supabase/server";

function SidebarPlaceholder() {
  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-stone-800 bg-stone-900/50 p-4">
      <div>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          Navigation
        </h2>
        <nav className="flex flex-col gap-2">
          <div className="rounded-md bg-stone-800/50 px-3 py-2 text-sm text-stone-200">
            Dashboard
          </div>
          <div className="rounded-md px-3 py-2 text-sm text-stone-400 transition-colors hover:bg-stone-800/30 hover:text-stone-300">
            Applicants
          </div>
          <div className="rounded-md px-3 py-2 text-sm text-stone-400 transition-colors hover:bg-stone-800/30 hover:text-stone-300">
            Settings
          </div>
        </nav>
      </div>
      <div>
        <Button className="w-full justify-start">Logout</Button>
      </div>
    </aside>
  );
}

interface ThemeConfig {
  primaryColor?: string;
  logoUrl?: string;
  fontFamily?: string;
  [key: string]: string | undefined;
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

  if (!tenantContext.tenant) {
    redirect("/login");
  }

  if (tenantContext.tenant.slug !== tenantSlug) {
    redirect(`/${tenantContext.tenant.slug}`);
  }

  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  const canAccessTenant =
    viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

  if (!canAccessTenant) {
    redirect("/login");
  }

  // Extract theme config, providing fallbacks if none exist
  const themeConfig = (tenantContext.tenant.themeConfig || {}) as ThemeConfig;

  const themeStyles = {
    "--primary": themeConfig.primaryColor || "#C6623E",
    "--background": "#0c0a09",
    "--foreground": "#fafaf9",
  } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="flex min-h-screen w-full bg-[var(--background,var(--color-stone-950))] text-[var(--foreground,var(--color-stone-50))]"
    >
      <SidebarPlaceholder />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
