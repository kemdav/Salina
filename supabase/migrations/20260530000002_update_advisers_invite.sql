-- Drop the old constraint and add a new one supporting 'invited'
ALTER TABLE public.advisers DROP CONSTRAINT IF EXISTS advisers_status_check;
ALTER TABLE public.advisers ADD CONSTRAINT advisers_status_check CHECK (status IN ('invited', 'pending', 'approved', 'rejected'));

-- Add invitation related columns
ALTER TABLE public.advisers 
  ADD COLUMN invite_token UUID UNIQUE DEFAULT extensions.gen_random_uuid(),
  ADD COLUMN invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN invited_at TIMESTAMPTZ DEFAULT NOW();

-- Make organization_name nullable since it may be filled out during sign up
ALTER TABLE public.advisers ALTER COLUMN organization_name DROP NOT NULL;
