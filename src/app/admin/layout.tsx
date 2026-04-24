import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { AuthenticatedShell } from '@/components/templates/authenticated-shell';
import { getCurrentViewer } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const viewer = await getCurrentViewer();

    if (!viewer) {
        redirect('/login');
    }

    return (
        <AuthenticatedShell role="Admin" userName={viewer.email?.split('@')[0] ?? 'Admin'}>
            {children}
        </AuthenticatedShell>
    );
}
