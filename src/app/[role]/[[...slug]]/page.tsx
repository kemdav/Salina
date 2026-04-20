'use client';

import { useParams } from 'next/navigation';
import { AuthenticatedShell } from '@/components/templates/authenticated-shell';
import { ComingSoon } from '@/components/organisms/coming-soon';
import { UserRole } from '@/lib/navigation-config';

export default function UniversalComingSoonPage() {
    // Grab the variables from the URL
    const params = useParams();
    
    // Extract the Role
    const rawRole = (params?.role as string) || 'admin';
    
    // Extract the Page/View 
    const slugArray = (params?.slug as string[]) || ['dashboard'];
    const rawView = slugArray[0] || 'dashboard';

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    
    let formattedRole = capitalize(rawRole);
    if (formattedRole.toLowerCase() === 'superadmin') formattedRole = 'SuperAdmin';
    const viewTitle = rawView.split('-').map(capitalize).join(' ');

    // Dummy tenant branding 
    const dummyTenant = {
        name: "Cebu Institute of Technology",
        primaryColor: "#c6623e", 
        textColor: "#ffffff"
    };

    return (
        <AuthenticatedShell 
            role={formattedRole as UserRole} 
            tenantBranding={dummyTenant}
        >
            <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-500">
                <ComingSoon moduleName={viewTitle} />
            </div>
        </AuthenticatedShell>
    );
}