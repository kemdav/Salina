-- Add adviser_notes to accreditation_requests
ALTER TABLE public.accreditation_requests
ADD COLUMN adviser_notes TEXT;

-- Update advisers SELECT policy to allow advisers to view the directory
DROP POLICY IF EXISTS "Authenticated users can view approved advisers" ON public.advisers;

CREATE OR REPLACE FUNCTION public.is_adviser()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.advisers
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Advisers and Admins can view advisers" 
    ON public.advisers 
    FOR SELECT TO authenticated
    USING (
      public.is_platform_admin() OR
      public.is_adviser()
    );
