import { resolveCurrentTenant } from "@/lib/supabase/server";
import { MemberDashboard } from "@/components/organisms/member-dashboard";
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingEvents,
} from "@/lib/dashboard-queries";

export default async function MemberDashboardPage() {
  const { tenant } = await resolveCurrentTenant();

  const [stats, recentActivity, upcomingEvents] = await Promise.all([
    getDashboardStats(),
    tenant ? getRecentActivity(tenant.id) : Promise.resolve([]),
    tenant ? getUpcomingEvents(tenant.id) : Promise.resolve([]),
  ]);

  return (
    <MemberDashboard
      stats={stats}
      recentActivity={recentActivity}
      upcomingEvents={upcomingEvents}
      tenantBranding={
        tenant
          ? {
              name: tenant.name,
              primaryColor:
                tenant.themeConfig.primaryColor ?? "#c6623e",
              textColor: "#ffffff",
              logoUrl: tenant.themeConfig.logoUrl ?? undefined,
              fontFamily: tenant.themeConfig.fontFamily ?? undefined,
            }
          : undefined
      }
    />
  );
}
