create or replace function public.current_tenant_id()
returns uuid
language plpgsql
stable
as $$
declare
  tenant_claim text;
begin
  tenant_claim := coalesce(
    auth.jwt() -> 'app_metadata' ->> 'tenant_id',
    auth.jwt() -> 'user_metadata' ->> 'tenant_id',
    auth.jwt() ->> 'tenant_id'
  );

  if tenant_claim is null or tenant_claim = '' then
    return null;
  end if;

  return tenant_claim::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' -> 'roles') ? 'system_admin',
    false
  )
  or coalesce(
    auth.jwt() -> 'app_metadata' ->> 'role' = 'system_admin',
    false
  );
$$;

create or replace function public.has_tenant_access(row_tenant_id uuid)
returns boolean
language sql
stable
as $$
  select coalesce(
    public.is_platform_admin() or row_tenant_id = public.current_tenant_id(),
    false
  );
$$;

create or replace function public.is_privileged_session()
returns boolean
language sql
stable
as $$
  select coalesce(auth.role() = 'service_role', false)
    or current_user in ('postgres', 'service_role', 'supabase_admin');
$$;

create or replace function public.enforce_tenant_scope()
returns trigger
language plpgsql
as $$
declare
  jwt_tenant_id uuid;
begin
  if public.is_privileged_session() then
    return new;
  end if;

  if public.is_platform_admin() then
    return new;
  end if;

  jwt_tenant_id := public.current_tenant_id();

  if jwt_tenant_id is null then
    raise exception 'tenant_id is missing from JWT metadata';
  end if;

  if new.tenant_id is null then
    new.tenant_id := jwt_tenant_id;
  elsif new.tenant_id <> jwt_tenant_id then
    raise exception 'cross-tenant write rejected';
  end if;

  return new;
end;
$$;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.tenant_domains enable row level security;
alter table public.projects enable row level security;
alter table public.audit_events enable row level security;

create trigger enforce_organization_memberships_tenant_scope
before insert or update on public.organization_memberships
for each row
execute function public.enforce_tenant_scope();

create trigger enforce_tenant_domains_tenant_scope
before insert or update on public.tenant_domains
for each row
execute function public.enforce_tenant_scope();

create trigger enforce_projects_tenant_scope
before insert or update on public.projects
for each row
execute function public.enforce_tenant_scope();

create trigger enforce_audit_events_tenant_scope
before insert or update on public.audit_events
for each row
execute function public.enforce_tenant_scope();

create policy organizations_tenant_isolation
  on public.organizations
  for all
  to authenticated
  using (public.has_tenant_access(id))
  with check (public.has_tenant_access(id));

create policy organization_memberships_tenant_isolation
  on public.organization_memberships
  for all
  to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

create policy tenant_domains_tenant_isolation
  on public.tenant_domains
  for all
  to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

create policy projects_tenant_isolation
  on public.projects
  for all
  to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

create policy audit_events_tenant_isolation
  on public.audit_events
  for all
  to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

grant execute on function public.current_tenant_id() to authenticated, service_role;
grant execute on function public.is_platform_admin() to authenticated, service_role;
grant execute on function public.has_tenant_access(uuid) to authenticated, service_role;
grant execute on function public.is_privileged_session() to authenticated, service_role;