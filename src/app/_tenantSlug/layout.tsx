import { redirect } from "next/navigation";

import { Button } from "@/components/atoms/button";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { TenantNameBadge } from "@/components/molecules/tenant-name-badge";
import {
  getCurrentViewer,
  resolveCurrentTenant,
  type ThemeConfig,
} from "@/lib/supabase/server";

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
        <TenantNameBadge />
      </div>
      <div>
        <Button className="w-full justify-start">Logout</Button>
      </div>
    </aside>
  );
}

function buildThemeStyles(themeConfig: ThemeConfig | null | undefined) {
  const primaryColor = themeConfig?.primaryColor ?? "#C6623E";

  return {
    "--primary": primaryColor,
    "--color-primary": primaryColor,
    "--primary-hover": `color-mix(in srgb, ${primaryColor} 85%, black)`,
    "--background": "#0c0a09",
    "--foreground": "#fafaf9",
    ...(themeConfig?.fontFamily
      ? {
          "--font-heading": themeConfig.fontFamily,
          "--font-body": themeConfig.fontFamily,
        }
      : {}),
  } as React.CSSProperties;
}

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenantContext = await resolveCurrentTenant();

  if (!tenantContext.tenant) {
    redirect("/login");
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

  const themeStyles = buildThemeStyles(tenantContext.tenant.themeConfig);

  return (
    <TenantProvider value={tenantContext}>
      <div
        style={themeStyles}
        className="flex min-h-screen w-full bg-(--background,var(--color-stone-950)) text-(--foreground,var(--color-stone-50))"
      >
        <SidebarPlaceholder />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </TenantProvider>
  );
}
