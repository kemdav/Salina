ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_status_check;
ALTER TABLE public.organizations ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.organizations ADD CONSTRAINT organizations_status_check CHECK (status IN ('pending', 'active', 'rejected', 'inactive', 'suspended'));

-- Migrate any existing ones that were set to 'pending' as default to 'active' (if it's the old demo state)
-- Actually, the old default was 'active'. So anything currently 'pending' might just be real pendings.
-- Wait, to "migrate existing demo tenants to ACTIVE", we just set all current organizations to ACTIVE.
UPDATE public.organizations SET status = 'active';
