create table public.organization_roles (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, name)
);

alter table public.organization_memberships
add column role_id uuid references public.organization_roles(id) on delete restrict;

create trigger set_organization_roles_updated_at
before update on public.organization_roles
for each row
execute function public.set_current_timestamp();

create trigger enforce_organization_roles_tenant_scope
before insert or update on public.organization_roles
for each row
execute function public.enforce_tenant_scope();

alter table public.organization_roles enable row level security;

create policy organization_roles_tenant_isolation_select
  on public.organization_roles
  for select
  to authenticated
  using (public.has_tenant_access(tenant_id));

create policy organization_roles_tenant_isolation_insert
  on public.organization_roles
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    exists (
      select 1 from public.organization_memberships
      where tenant_id = organization_roles.tenant_id
      and user_id = auth.uid()
      and role in ('admin', 'owner', 'system_admin')
    )
  );

create policy organization_roles_tenant_isolation_update
  on public.organization_roles
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    exists (
      select 1 from public.organization_memberships
      where tenant_id = organization_roles.tenant_id
      and user_id = auth.uid()
      and role in ('admin', 'owner', 'system_admin')
    )
  )
  with check (
    public.has_tenant_access(tenant_id) and
    exists (
      select 1 from public.organization_memberships
      where tenant_id = organization_roles.tenant_id
      and user_id = auth.uid()
      and role in ('admin', 'owner', 'system_admin')
    )
  );

create policy organization_roles_tenant_isolation_delete
  on public.organization_roles
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    exists (
      select 1 from public.organization_memberships
      where tenant_id = organization_roles.tenant_id
      and user_id = auth.uid()
      and role in ('admin', 'owner', 'system_admin')
    )
  );

grant select, insert, update, delete on public.organization_roles to authenticated, service_role;
