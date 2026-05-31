create or replace function public.is_announcement_manager(p_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships m
    left join public.organization_roles r on m.role_id = r.id
    where m.tenant_id = p_tenant_id
      and m.user_id = auth.uid()
      and (
        m.role in ('admin', 'owner', 'system_admin', 'officer')
        or r.permissions ? 'Announcement posting'
      )
  ) or public.is_platform_admin();
$$;

drop policy if exists announcements_tenant_isolation_insert on public.announcements;

create policy announcements_tenant_isolation_insert
  on public.announcements
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_announcement_manager(tenant_id)
  );
