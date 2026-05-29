import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import { OfficerDashboard } from "@/components/organisms/officer-dashboard";
import {
  getDashboardStats,
  getRecentActivity,
  getUpcomingEvents,
  getMemberSummary,
} from "@/lib/dashboard-queries";

export default async function OfficerDashboardPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  const [stats, recentActivity, upcomingEvents, memberSummary] =
    await Promise.all([
      getDashboardStats(),
      tenant ? getRecentActivity(tenant.id) : Promise.resolve([]),
      tenant ? getUpcomingEvents(tenant.id) : Promise.resolve([]),
      getMemberSummary(),
    ]);

  return (
    <OfficerDashboard
      stats={stats}
      recentActivity={recentActivity}
      upcomingEvents={upcomingEvents}
      memberSummary={memberSummary}
      customPermissions={viewer?.customPermissions ?? []}
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
