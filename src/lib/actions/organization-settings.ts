'use server';

import { createClient } from '@supabase/supabase-js';

import { getCurrentViewer, resolveCurrentTenant } from '@/lib/supabase/server';

type OrganizationSettingsState = {
    error?: string;
    success?: string;
};

const ORGANIZATION_TYPE_OPTIONS = new Set([
    'Professional',
    'Academic',
    'Social',
    'Civic',
    'Other',
]);

function createSupabaseAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        return null;
    }

    return createClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        global: {
            headers: {
                'x-salina-server-client': 'organization-settings',
            },
        },
    });
}

function parseThemeConfig(formValue: FormDataEntryValue | null) {
    if (typeof formValue !== 'string' || !formValue.trim()) {
        return null;
    }

    try {
        const parsed = JSON.parse(formValue) as Record<string, unknown>;

        if (!parsed || typeof parsed !== 'object') {
            return null;
        }

        return {
            fontFamily: typeof parsed.fontFamily === 'string' ? parsed.fontFamily.trim() : undefined,
            logoUrl: typeof parsed.logoUrl === 'string' ? parsed.logoUrl.trim() : undefined,
            primaryColor: typeof parsed.primaryColor === 'string' ? parsed.primaryColor.trim() : undefined,
        };
    } catch {
        return null;
    }
}

function getFormValue(formData: FormData, key: string) {
    const value = formData.get(key);

    return typeof value === 'string' ? value.trim() : '';
}

export async function updateOrganizationSettings(
    _previousState: OrganizationSettingsState,
    formData: FormData,
): Promise<OrganizationSettingsState> {
    const client = createSupabaseAdminClient();
    const viewer = await getCurrentViewer();
    const tenantContext = await resolveCurrentTenant();

    if (!client) {
        return { error: 'Organization settings cannot be saved right now.' };
    }

    if (!viewer || !tenantContext.tenant) {
        return { error: 'You must be signed in to update organization settings.' };
    }

    const canAccessTenant = viewer.isPlatformAdmin || viewer.tenantId === tenantContext.tenant.id;

    if (!canAccessTenant) {
        return { error: 'You do not have permission to update this organization.' };
    }

    const name = getFormValue(formData, 'name');
    const billingEmail = getFormValue(formData, 'billingEmail');
    const organizationType = getFormValue(formData, 'organizationType');
    const themeConfig = parseThemeConfig(formData.get('themeConfig'));

    const updatePayload: Record<string, unknown> = {};

    if (name) {
        updatePayload.name = name;
    }

    if (billingEmail) {
        updatePayload.billing_email = billingEmail;
    } else if (billingEmail === '') {
        updatePayload.billing_email = null;
    }

    if (organizationType) {
        if (!ORGANIZATION_TYPE_OPTIONS.has(organizationType)) {
            return { error: 'Select a valid organization type.' };
        }

        updatePayload.organization_type = organizationType;
    }

    if (themeConfig) {
        updatePayload.theme_config = {
            ...tenantContext.tenant.themeConfig,
            ...themeConfig,
        };
    }

    if (Object.keys(updatePayload).length === 0) {
        return { error: 'Nothing to save.' };
    }

    const { error } = await client
        .from('organizations')
        .update(updatePayload)
        .eq('id', tenantContext.tenant.id);

    if (error) {
        return { error: error.message };
    }

    return { success: 'Organization settings saved.' };
}

export type { OrganizationSettingsState };
