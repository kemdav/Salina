create table public.events (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  location text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.event_attendees (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  member_id uuid not null references public.organization_memberships(id) on delete cascade,
  status text not null default 'Pending' check (status in ('Pending', 'Verified', 'Flagged', 'Rejected')),
  check_in_time timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (event_id, member_id)
);

create index events_tenant_id_idx on public.events (tenant_id);
create index event_attendees_tenant_id_idx on public.event_attendees (tenant_id);
create index event_attendees_event_id_idx on public.event_attendees (event_id);
create index event_attendees_member_id_idx on public.event_attendees (member_id);

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_current_timestamp();

create trigger set_event_attendees_updated_at
before update on public.event_attendees
for each row
execute function public.set_current_timestamp();

create trigger enforce_events_tenant_scope
before insert or update on public.events
for each row
execute function public.enforce_tenant_scope();

create trigger enforce_event_attendees_tenant_scope
before insert or update on public.event_attendees
for each row
execute function public.enforce_tenant_scope();

alter table public.events enable row level security;
alter table public.event_attendees enable row level security;

create or replace function public.is_event_manager(p_tenant_id uuid)
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

-- Policies for events
create policy events_tenant_isolation_select
  on public.events
  for select
  to authenticated
  using (public.has_tenant_access(tenant_id));

create policy events_tenant_isolation_insert
  on public.events
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_event_manager(tenant_id)
  );

create policy events_tenant_isolation_update
  on public.events
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_event_manager(tenant_id)
  )
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_event_manager(tenant_id)
  );

create policy events_tenant_isolation_delete
  on public.events
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_event_manager(tenant_id)
  );

-- Policies for event_attendees
create policy event_attendees_isolation_select
  on public.event_attendees
  for select
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and (
      public.is_event_manager(tenant_id) or
      exists (
        select 1 from public.organization_memberships
        where id = event_attendees.member_id and user_id = auth.uid()
      )
    )
  );

create policy event_attendees_isolation_insert
  on public.event_attendees
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and (
      public.is_event_manager(tenant_id) or
      exists (
        select 1 from public.organization_memberships
        where id = event_attendees.member_id and user_id = auth.uid()
      )
    )
  );

create policy event_attendees_isolation_update
  on public.event_attendees
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and public.is_event_manager(tenant_id)
  )
  with check (
    public.has_tenant_access(tenant_id) and public.is_event_manager(tenant_id)
  );

create policy event_attendees_isolation_delete
  on public.event_attendees
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and public.is_event_manager(tenant_id)
  );

grant select, insert, update, delete on public.events to authenticated, service_role;
grant select, insert, update, delete on public.event_attendees to authenticated, service_role;
