create or replace function public.is_event_manager(p_tenant_id uuid)
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
        or r.permissions ? 'Event management'
      )
  ) or public.is_platform_admin();
$$;
