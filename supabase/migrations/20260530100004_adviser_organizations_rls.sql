CREATE OR REPLACE FUNCTION public.is_approved_adviser()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    from public.advisers 
    WHERE user_id = auth.uid() 
      AND status = 'approved'
  );
$$;

CREATE POLICY "Approved advisers can view organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (public.is_approved_adviser());
