create table public.announcements (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.announcement_acknowledgments (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  acknowledged_at timestamptz not null default timezone('utc', now()),
  unique(announcement_id, user_id)
);

-- Triggers for tenant scope
create trigger enforce_tenant_scope_announcements
  before insert or update or delete on public.announcements
  for each row execute function public.enforce_tenant_scope();

create trigger enforce_tenant_scope_announcement_acknowledgments
  before insert or update or delete on public.announcement_acknowledgments
  for each row execute function public.enforce_tenant_scope();

-- Row level security
alter table public.announcements enable row level security;
alter table public.announcement_acknowledgments enable row level security;

-- Policies for announcements
create policy announcements_tenant_isolation_select
  on public.announcements
  for select
  to authenticated
  using (public.has_tenant_access(tenant_id));

create policy announcements_tenant_isolation_insert
  on public.announcements
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    exists (
      select 1 from public.organization_memberships
      where organization_memberships.tenant_id = announcements.tenant_id
        and organization_memberships.user_id = auth.uid()
        and organization_memberships.role in ('admin', 'owner', 'system_admin', 'officer')
    )
  );

-- Policies for announcement_acknowledgments
create policy announcement_acknowledgments_tenant_isolation_select
  on public.announcement_acknowledgments
  for select
  to authenticated
  using (public.has_tenant_access(tenant_id));

create policy announcement_acknowledgments_tenant_isolation_insert
  on public.announcement_acknowledgments
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    user_id = auth.uid()
  );

grant select, insert on public.announcements to authenticated, service_role;
grant select, insert on public.announcement_acknowledgments to authenticated, service_role;
