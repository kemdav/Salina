import {
  getAnnouncements,
  acknowledgeAnnouncement,
} from "@/lib/actions/announcements";
import { resolveCurrentTenant, getCurrentViewer } from "@/lib/supabase/server";
import {
  AnnouncementsBoard,
  type Announcement,
} from "@/components/organisms/announcements-board";
import { CreateAnnouncementForm } from "@/components/organisms/create-announcement-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Feed | Salina",
};

export default async function AdminFeedPage() {
  const { tenant } = await resolveCurrentTenant();
  const viewer = await getCurrentViewer();

  if (!tenant || !viewer) {
    notFound();
  }

  const announcements = await getAnnouncements();

  return (
    <div className="w-full max-w-4xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Organization Feed
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Post and track official announcements for {tenant.name}.
        </p>
      </div>

      <CreateAnnouncementForm />

      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Posted Announcements
      </h2>
      <AnnouncementsBoard
        announcements={announcements as Announcement[]}
        onAcknowledge={acknowledgeAnnouncement}
        isOfficerOrAdmin={true}
      />
    </div>
  );
}
