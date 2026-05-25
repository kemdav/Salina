alter table public.organization_memberships
add column membership_status text not null default 'Active' check (membership_status in ('Active', 'Probation', 'Alumni', 'Suspended')),
add column dues_status text not null default 'Unpaid' check (dues_status in ('Paid', 'Unpaid')),
add column tags text[] not null default '{}';

create or replace function public.get_tenant_members(p_tenant_id uuid)
returns table (
  membership_id uuid,
  tenant_id uuid,
  user_id uuid,
  role text,
  status text,
  dues text,
  tags text[],
  joined_at timestamptz,
  email varchar,
  name varchar
)
security definer
set search_path = public
language plpgsql
as $$
begin
  if not public.has_tenant_access(p_tenant_id) and not public.is_platform_admin() then
    raise exception 'Unauthorized';
  end if;

  return query
  select
    om.id,
    om.tenant_id,
    om.user_id,
    om.role,
    om.membership_status,
    om.dues_status,
    om.tags,
    om.created_at,
    au.email::varchar,
    (au.raw_user_meta_data->>'display_name')::varchar
  from public.organization_memberships om
  join auth.users au on om.user_id = au.id
  where om.tenant_id = p_tenant_id;
end;
$$;
