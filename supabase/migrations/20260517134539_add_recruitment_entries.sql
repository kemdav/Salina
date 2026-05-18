create table public.recruitment_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'closed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index recruitment_entries_tenant_id_idx on public.recruitment_entries (tenant_id);

create trigger set_recruitment_entries_updated_at
  before update on public.recruitment_entries
  for each row execute function public.set_current_timestamp();

alter table public.temporary_applicants 
  add column recruitment_entry_id uuid references public.recruitment_entries(id) on delete set null;

create index temporary_applicants_recruitment_entry_id_idx on public.temporary_applicants (recruitment_entry_id);

-- Apply Security Rules
alter table public.recruitment_entries enable row level security;

create policy "tenant_isolation" on public.recruitment_entries
  for all to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

create trigger enforce_recruitment_entries_tenant_scope
  before insert or update on public.recruitment_entries
  for each row execute function public.enforce_tenant_scope();

grant all on public.recruitment_entries to authenticated;
grant all on public.recruitment_entries to service_role;
