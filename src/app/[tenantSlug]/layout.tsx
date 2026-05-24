import { redirect } from "next/navigation";

import { signOut } from "@/lib/actions/auth";
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
        <form action={signOut}>
          <Button className="w-full justify-start" type="submit">Logout</Button>
        </form>
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
    if (tenantContext.resolutionError === "This organization has been suspended.") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-50">
          <div className="text-center p-8 border border-red-900/30 rounded-xl bg-red-950/10">
            <h1 className="mb-4 text-3xl font-bold text-red-500">Organization Suspended</h1>
            <p className="text-stone-300">Your organization's access has been temporarily suspended.</p>
            <p className="mt-2 text-stone-500 text-sm">Please contact the platform administrator for assistance.</p>
          </div>
        </div>
      );
    }
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
