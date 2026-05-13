create table public.temporary_applicants (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  applicant_name text not null,
  applicant_email extensions.citext not null,
  invite_token uuid not null unique default extensions.gen_random_uuid(),
  invited_by uuid references auth.users(id) on delete set null,
  applicant_user_id uuid references auth.users(id) on delete set null,
  status text not null default 'invited' check (status in ('invited', 'submitted', 'approved', 'converted', 'rejected')),
  application_data jsonb not null default '{}'::jsonb,
  invited_at timestamptz not null default timezone('utc', now()),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  converted_membership_id uuid references public.organization_memberships(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, applicant_email)
);

create index temporary_applicants_tenant_id_idx
  on public.temporary_applicants (tenant_id);

create index temporary_applicants_invite_token_idx
  on public.temporary_applicants (invite_token);

create index temporary_applicants_applicant_user_id_idx
  on public.temporary_applicants (applicant_user_id);

create index temporary_applicants_status_idx
  on public.temporary_applicants (status);

create trigger set_temporary_applicants_updated_at
before update on public.temporary_applicants
for each row
execute function public.set_current_timestamp();