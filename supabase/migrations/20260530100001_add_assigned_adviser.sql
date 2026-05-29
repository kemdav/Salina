ALTER TABLE public.accreditation_requests
ADD COLUMN assigned_adviser_id UUID REFERENCES public.advisers(id) ON DELETE SET NULL;
