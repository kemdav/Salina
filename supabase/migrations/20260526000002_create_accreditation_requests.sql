CREATE TYPE public.accreditation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.accreditation_requests (
    id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_name TEXT NOT NULL,
    org_slug TEXT NOT NULL UNIQUE,
    org_type TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    status public.accreditation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.accreditation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accreditation requests" 
    ON public.accreditation_requests 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accreditation requests" 
    ON public.accreditation_requests 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Platform admins can view all accreditation requests" 
    ON public.accreditation_requests 
    FOR SELECT TO authenticated
    USING (public.is_platform_admin());

CREATE POLICY "Platform admins can update accreditation requests" 
    ON public.accreditation_requests 
    FOR UPDATE TO authenticated
    USING (public.is_platform_admin());

-- Trigger for updated_at
CREATE TRIGGER set_accreditation_requests_updated_at
  BEFORE UPDATE ON public.accreditation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp();
