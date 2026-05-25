import { getMembers } from '@/lib/actions/members';
import { MembersTable } from '@/components/organisms/members-table';
import { InviteMemberModal } from '@/components/organisms/invite-member-modal';

export default async function MembersPage() {
    const members = await getMembers();

    return (
        <div style={{ fontFamily: 'var(--font-body)' }}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1
                        className="text-3xl font-bold tracking-tight text-foreground"
                        style={{ fontFamily: 'var(--font-heading)' }}
                    >
                        Roster
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">{members.length} total members</p>
                </div>
                <InviteMemberModal />
            </div>

            <MembersTable initialMembers={members} />
        </div>
    );
}
