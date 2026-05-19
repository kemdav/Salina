create table public.organization_roles (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  permissions jsonb default '[]'::jsonb check (jsonb_typeof(permissions) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, name),
  unique (tenant_id, id)
);

alter table public.organization_memberships
add column role_id uuid,
add constraint fk_org_memberships_role
  foreign key (tenant_id, role_id)
  references public.organization_roles(tenant_id, id) on delete restrict;

create index organization_memberships_role_id_idx on public.organization_memberships (role_id);

create trigger set_organization_roles_updated_at
before update on public.organization_roles
for each row
execute function public.set_current_timestamp();

create trigger enforce_organization_roles_tenant_scope
before insert or update on public.organization_roles
for each row
execute function public.enforce_tenant_scope();

alter table public.organization_roles enable row level security;

create or replace function public.is_tenant_admin(p_tenant_id uuid)
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
      and role in ('admin', 'owner', 'system_admin')
  ) or public.is_platform_admin();
$$;

create policy organization_roles_tenant_isolation_select
  on public.organization_roles
  for select
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and 
    public.is_tenant_admin(tenant_id)
  );

create policy organization_roles_tenant_isolation_insert
  on public.organization_roles
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

create policy organization_roles_tenant_isolation_update
  on public.organization_roles
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

create policy organization_roles_tenant_isolation_delete
  on public.organization_roles
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

grant select, insert, update, delete on public.organization_roles to authenticated, service_role;