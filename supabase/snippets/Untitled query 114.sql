DO $$
DECLARE
  v_tenant_id uuid;
  v_entry_id uuid;
BEGIN
  -- 1. Get the Acme organization ID
  SELECT id INTO v_tenant_id FROM public.organizations WHERE slug = 'acme' LIMIT 1;
  
  -- 2. Create a test recruitment cycle
  INSERT INTO public.recruitment_entries (tenant_id, title, description, status)
  VALUES (v_tenant_id, 'Fall 2026 Hiring (Test)', 'This is a test cycle', 'published')
  RETURNING id INTO v_entry_id;
  
  -- 3. Insert Jane Doe into that cycle
  INSERT INTO public.temporary_applicants (
    tenant_id, 
    applicant_name, 
    applicant_email, 
    status, 
    recruitment_entry_id, 
    application_data
  )
  VALUES (
    v_tenant_id, 
    'Jane Doe', 
    'jane@example.com', 
    'invited', 
    v_entry_id, 
    '{"stage": "application"}'::jsonb
  );
END $$;