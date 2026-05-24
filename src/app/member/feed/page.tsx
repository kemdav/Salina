import { OrganizationFeed } from "@/components/organisms/organization-feed";

const feedPosts = [
  {
    title: "Weekend outreach schedule confirmed",
    category: "Operations",
    author: "Secretariat Office",
    time: "12 minutes ago",
    body: "The outreach team will gather at 7:30 AM on Saturday. Logistics, name tags, and transportation are already locked in.",
    stats: "17 reads · 4 acknowledgements",
  },
  {
    title: "Attendance sheet updated for the annual assembly",
    category: "Attendance",
    author: "Attendance Committee",
    time: "Today at 8:15 AM",
    body: "The QR check-in link has been regenerated and the backup manual list is ready at the registration desk.",
    stats: "23 reads · 6 confirmations",
  },
];

export default function MemberFeedPage() {
  return (
    <div className="py-8">
      <OrganizationFeed posts={feedPosts} canPost={false} />
    </div>
  );
}
