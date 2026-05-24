'use server';

import { createClient } from '@supabase/supabase-js';

import { getCurrentViewer, resolveCurrentTenant } from '@/lib/supabase/server';
import { RESERVED_SUBDOMAINS } from '@/lib/reserved-subdomains';

export type OrganizationSettingsState = {
    error?: string;
    success?: string;
};

const ORGANIZATION_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ORGANIZATION_TYPE_OPTIONS = new Set([
    'Business / Corporation',
    'Non-Profit Organization',
    'Association / Society',
    'Academic Institution',
    'Government Agency',
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
    const slug = getFormValue(formData, 'slug').toLowerCase();
    const billingEmail = getFormValue(formData, 'billingEmail');
    const organizationType = getFormValue(formData, 'organizationType');
    const themeConfig = parseThemeConfig(formData.get('themeConfig'));

    const updatePayload: Record<string, unknown> = {};

    if (name) {
        updatePayload.name = name;
    }

    if (slug && slug !== tenantContext.tenant.slug.toLowerCase()) {
        if (!ORGANIZATION_SLUG_PATTERN.test(slug)) {
            return { error: 'Slug must use only lowercase letters, numbers, and single hyphens, and cannot start or end with a hyphen.' };
        }

        if (RESERVED_SUBDOMAINS.has(slug)) {
            return { error: 'This subdomain is reserved.' };
        }

        updatePayload.slug = slug;
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
