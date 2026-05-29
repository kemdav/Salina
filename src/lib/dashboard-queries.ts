import { cache } from "react";
import {
  createSupabaseUserClient,
  resolveCurrentTenant,
  getCurrentViewer,
} from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  memberCount: number;
  eventCount: number;
  announcementCount: number;
  pendingApplicantCount: number;
}

export interface ActivityItem {
  kind: "announcement" | "event" | "audit";
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  category?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
  month: string;
  day: number;
  time: string;
  type: string;
  status: string;
}

export interface MemberSummary {
  total: number;
  byStatus: Record<string, number>;
  byDues: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function monthLabel(date: Date): string {
  return date.toLocaleString("en-US", { month: "short" });
}

// ---------------------------------------------------------------------------
// Query functions (all cached via React cache())
// ---------------------------------------------------------------------------

export const getDashboardStats = cache(
  async (/* tenantId is extracted internally */): Promise<DashboardStats> => {
    const { tenant } = await resolveCurrentTenant();
    const userClient = await createSupabaseUserClient();

    if (!tenant || !userClient) {
      return {
        memberCount: 0,
        eventCount: 0,
        announcementCount: 0,
        pendingApplicantCount: 0,
      };
    }

    const [memberResult, eventResult, announcementResult, applicantResult] =
      await Promise.all([
        userClient
          .from("organization_memberships")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),

        userClient
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),

        userClient
          .from("announcements")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),

        userClient
          .from("temporary_applicants")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", tenant.id)
          .eq("status", "submitted"),
      ]);

    return {
      memberCount: memberResult.count ?? 0,
      eventCount: eventResult.count ?? 0,
      announcementCount: announcementResult.count ?? 0,
      pendingApplicantCount: applicantResult.count ?? 0,
    };
  },
);

export const getRecentActivity = cache(
  async (
    tenantId: string,
    limit = 8,
  ): Promise<ActivityItem[]> => {
    const userClient = await createSupabaseUserClient();
    if (!userClient) return [];

    const [announcementResult, eventResult] = await Promise.all([
      userClient
        .from("announcements")
        .select("id, title, body, created_at, category")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(limit),

      userClient
        .from("events")
        .select("id, title, description, start_time")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const items: ActivityItem[] = [];

    for (const a of announcementResult.data ?? []) {
      items.push({
        kind: "announcement",
        id: a.id,
        title: a.title,
        description: a.body?.slice(0, 120) ?? undefined,
        timestamp: a.created_at,
        category: a.category ?? undefined,
      });
    }

    for (const e of eventResult.data ?? []) {
      items.push({
        kind: "event",
        id: e.id,
        title: e.title,
        description: e.description?.slice(0, 120) ?? undefined,
        timestamp: e.start_time,
      });
    }

    // Sort merged list by timestamp descending
    items.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return items.slice(0, limit);
  },
);

export const getUpcomingEvents = cache(
  async (
    tenantId: string,
    limit = 4,
  ): Promise<UpcomingEvent[]> => {
    const userClient = await createSupabaseUserClient();
    if (!userClient) return [];

    const now = new Date().toISOString();

    const { data } = await userClient
      .from("events")
      .select("id, title, description, location, start_time, end_time")
      .eq("tenant_id", tenantId)
      .gte("start_time", now)
      .order("start_time", { ascending: true })
      .limit(limit);

    return (data ?? []).map((event) => {
      const start = new Date(event.start_time);
      const timeStr = start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return {
        id: event.id,
        title: event.title,
        description: event.description ?? "",
        location: event.location ?? "TBD",
        start_time: event.start_time,
        end_time: event.end_time,
        date: event.start_time,
        month: monthLabel(start),
        day: start.getDate(),
        time: timeStr,
        type: "Event",
        status: "upcoming",
      };
    });
  },
);

export const getMemberSummary = cache(
  async (): Promise<MemberSummary> => {
    const { tenant } = await resolveCurrentTenant();
    const viewer = await getCurrentViewer();
    const adminClient = createSupabaseAdminClient("getMemberSummary");

    if (!tenant || !viewer || !adminClient) {
      return { total: 0, byStatus: {}, byDues: {} };
    }

    const { data } = await adminClient
      .from("organization_memberships")
      .select("membership_status, dues_status")
      .eq("tenant_id", tenant.id);

    const members = data ?? [];
    const byStatus: Record<string, number> = {};
    const byDues: Record<string, number> = {};

    for (const m of members) {
      const status = m.membership_status ?? "Active";
      byStatus[status] = (byStatus[status] ?? 0) + 1;

      const dues = m.dues_status ?? "Unpaid";
      byDues[dues] = (byDues[dues] ?? 0) + 1;
    }

    return { total: members.length, byStatus, byDues };
  },
);

/**
 * Returns the number of memberships for the current tenant, scoped to the
 * given status filter. Primarily used for stat cards.
 */
export const getMemberCountByStatus = cache(
  async (status: string): Promise<number> => {
    const { tenant } = await resolveCurrentTenant();
    const userClient = await createSupabaseUserClient();
    if (!tenant || !userClient) return 0;

    const { count } = await userClient
      .from("organization_memberships")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenant.id)
      .eq("membership_status", status);

    return count ?? 0;
  },
);
