CREATE TABLE public.advisers (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.advisers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can manage advisers" 
    ON public.advisers 
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

CREATE POLICY "Authenticated users can view approved advisers" 
    ON public.advisers 
    FOR SELECT TO authenticated
    USING (status = 'approved');

-- Triggers
CREATE TRIGGER enforce_advisers_tenant_scope
  BEFORE INSERT OR UPDATE ON public.advisers
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_tenant_scope();

CREATE TRIGGER set_advisers_updated_at
  BEFORE UPDATE ON public.advisers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp();

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.advisers TO authenticated;
