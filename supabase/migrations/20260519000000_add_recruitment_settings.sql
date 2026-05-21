-- Add JSONB settings column to store custom recruitment pipeline configurations
-- e.g. {"stages": [{"id": "xyz", "name": "Initial Screening", "type": "form", "questions": []}]}

ALTER TABLE public.recruitment_entries 
ADD COLUMN settings jsonb DEFAULT '{"stages": []}'::jsonb NOT NULL;
