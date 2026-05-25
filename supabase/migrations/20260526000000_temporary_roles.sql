alter table public.organization_roles
add column is_assignable_to_members boolean not null default false;

alter table public.organization_memberships
add column role_expires_at timestamptz;
