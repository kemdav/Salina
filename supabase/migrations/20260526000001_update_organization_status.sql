ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_status_check;
ALTER TABLE public.organizations ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE public.organizations ADD CONSTRAINT organizations_status_check CHECK (status IN ('pending', 'active', 'rejected', 'inactive', 'suspended'));

-- Preserve existing organizations (like demo tenants) as active in this migration.
UPDATE public.organizations SET status = 'active';
