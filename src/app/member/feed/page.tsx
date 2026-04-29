import { AuthenticatedShell } from "@/components/templates/authenticated-shell";
import { OrganizationFeed } from "@/components/organisms/organization-feed";

// Dummy data for testing the Member view
const dummyTenant = {
    name: "Cebu Institute of Technology - University",
    primaryColor: "#c6623e",
    textColor: "#ffffff"
};

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
        <AuthenticatedShell role="Member" tenantBranding={dummyTenant}>
            <div className="py-8">
                {/* 
                  Here is the magic! 
                  canPost={false} hides the complex officer publishing form, 
                  leaving only the read-only feed for the member.
                */}
                <OrganizationFeed
                    posts={feedPosts}
                    canPost={false}
                    primaryColor={dummyTenant.primaryColor}
                />
            </div>
        </AuthenticatedShell>
    );
}