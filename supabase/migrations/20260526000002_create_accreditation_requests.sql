CREATE TYPE public.accreditation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.accreditation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    FOR SELECT 
    USING (
        (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')::text) = 'system_admin' OR
        'system_admin' = ANY (SELECT jsonb_array_elements_text(COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb)))
    );

CREATE POLICY "Platform admins can update accreditation requests" 
    ON public.accreditation_requests 
    FOR UPDATE 
    USING (
        (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')::text) = 'system_admin' OR
        'system_admin' = ANY (SELECT jsonb_array_elements_text(COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb)))
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_accreditation_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_accreditation_updated
  BEFORE UPDATE ON public.accreditation_requests
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_accreditation_updated_at();
