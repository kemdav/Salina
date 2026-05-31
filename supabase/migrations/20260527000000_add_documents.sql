-- Create is_tenant_officer_or_admin function
create or replace function public.is_tenant_officer_or_admin(p_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships
    where tenant_id = p_tenant_id
      and user_id = auth.uid()
      and role in ('admin', 'owner', 'system_admin', 'officer')
  ) or public.is_platform_admin();
$$;

-- Create documents table
create table public.documents (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null check (category in ('constitution', 'minutes', 'forms', 'guides', 'other')),
  file_name text not null,
  file_size bigint not null,
  storage_path text not null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Triggers and indexes
create index documents_tenant_id_idx on public.documents (tenant_id);

create trigger set_documents_updated_at
before update on public.documents
for each row
execute function public.set_current_timestamp();

create trigger enforce_documents_tenant_scope
before insert or update on public.documents
for each row
execute function public.enforce_tenant_scope();

-- RLS policies
alter table public.documents enable row level security;

create policy documents_tenant_isolation_select
  on public.documents
  for select
  to authenticated
  using (
    public.has_tenant_access(tenant_id)
  );

create policy documents_tenant_isolation_insert
  on public.documents
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_officer_or_admin(tenant_id)
  );

create policy documents_tenant_isolation_delete
  on public.documents
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

create policy documents_tenant_isolation_update
  on public.documents
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  )
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

grant select, insert, update, delete on public.documents to authenticated, service_role;

-- Storage bucket and RLS policies — requires Supabase storage extension to be loaded.
-- In local dev (supabase start), storage tables are initialized after migrations.
-- The bucket and policies will be applied by the `supabase db push` or on first `supabase start`
-- where the storage extension is already available.
-- For CI environments, the storage schema is pre-built by Supabase's Docker image.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'storage' and table_name = 'buckets'
  ) then
    insert into storage.buckets (id, name, public, file_size_limit)
    values ('org-documents', 'org-documents', false, 52428800)
    on conflict (id) do nothing;

    create policy "Authenticated users can read documents in their tenant"
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'org-documents' and
        public.has_tenant_access((storage.foldername(name))[1]::uuid)
      );

    create policy "Officers and Admins can upload documents to their tenant"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'org-documents' and
        public.has_tenant_access((storage.foldername(name))[1]::uuid) and
        public.is_tenant_officer_or_admin((storage.foldername(name))[1]::uuid)
      );

    create policy "Admins can delete documents from their tenant"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'org-documents' and
        public.has_tenant_access((storage.foldername(name))[1]::uuid) and
        public.is_tenant_admin((storage.foldername(name))[1]::uuid)
      );
  end if;
end
$$;
