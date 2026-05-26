-- Create document_folders table
create table public.document_folders (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  parent_id uuid references public.document_folders(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Triggers and indexes
create index document_folders_tenant_id_idx on public.document_folders (tenant_id);
create index document_folders_parent_id_idx on public.document_folders (parent_id);

create trigger set_document_folders_updated_at
before update on public.document_folders
for each row
execute function public.set_current_timestamp();

create trigger enforce_document_folders_tenant_scope
before insert or update on public.document_folders
for each row
execute function public.enforce_tenant_scope();

-- RLS policies
alter table public.document_folders enable row level security;

create policy document_folders_tenant_isolation_select
  on public.document_folders
  for select
  to authenticated
  using (
    public.has_tenant_access(tenant_id)
  );

create policy document_folders_tenant_isolation_insert
  on public.document_folders
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_officer_or_admin(tenant_id)
  );

create policy document_folders_tenant_isolation_update
  on public.document_folders
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_officer_or_admin(tenant_id)
  )
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_officer_or_admin(tenant_id)
  );

create policy document_folders_tenant_isolation_delete
  on public.document_folders
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

grant select, insert, update, delete on public.document_folders to authenticated, service_role;

-- Modify documents table to link to folders
alter table public.documents
add column folder_id uuid references public.document_folders(id) on delete cascade;

create index documents_folder_id_idx on public.documents (folder_id);
