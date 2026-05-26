create type public.document_visibility as enum ('public', 'roles', 'members', 'password_protected');

alter table public.document_folders
add column visibility document_visibility not null default 'public',
add column password_hash text;

alter table public.documents
add column visibility document_visibility not null default 'public',
add column password_hash text;

create table public.document_access_roles (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  role text not null check (role in ('system_admin', 'owner', 'admin', 'member', 'viewer', 'officer')),
  created_at timestamptz not null default timezone('utc', now()),
  check ((folder_id is not null and document_id is null) or (folder_id is null and document_id is not null))
);

create table public.document_access_members (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  check ((folder_id is not null and document_id is null) or (folder_id is null and document_id is not null)),
  unique(folder_id, user_id),
  unique(document_id, user_id)
);

-- RLS for new tables
alter table public.document_access_roles enable row level security;
alter table public.document_access_members enable row level security;

create policy access_roles_tenant_isolation_select on public.document_access_roles for select to authenticated using (public.has_tenant_access(tenant_id));
create policy access_roles_tenant_isolation_insert on public.document_access_roles for insert to authenticated with check (public.has_tenant_access(tenant_id) and public.is_tenant_officer_or_admin(tenant_id));
create policy access_roles_tenant_isolation_delete on public.document_access_roles for delete to authenticated using (public.has_tenant_access(tenant_id) and public.is_tenant_officer_or_admin(tenant_id));

create policy access_members_tenant_isolation_select on public.document_access_members for select to authenticated using (public.has_tenant_access(tenant_id));
create policy access_members_tenant_isolation_insert on public.document_access_members for insert to authenticated with check (public.has_tenant_access(tenant_id) and public.is_tenant_officer_or_admin(tenant_id));
create policy access_members_tenant_isolation_delete on public.document_access_members for delete to authenticated using (public.has_tenant_access(tenant_id) and public.is_tenant_officer_or_admin(tenant_id));

grant select, insert, update, delete on public.document_access_roles to authenticated, service_role;
grant select, insert, update, delete on public.document_access_members to authenticated, service_role;
