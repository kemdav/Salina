alter table public.organization_memberships
  drop constraint if exists organization_memberships_role_check;

alter table public.organization_memberships
  add constraint organization_memberships_role_check
  check (role in ('system_admin', 'owner', 'admin', 'officer', 'member', 'viewer'));