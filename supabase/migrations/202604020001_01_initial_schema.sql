create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

create or replace function public.set_current_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default extensions.gen_random_uuid(),
  slug extensions.citext not null unique,
  name text not null,
  plan text not null default 'system',
  billing_email extensions.citext,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.organization_memberships (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('system_admin', 'owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id)
);

create table public.tenant_domains (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  host extensions.citext not null unique,
  is_primary boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index tenant_domains_one_primary_per_tenant_idx
  on public.tenant_domains (tenant_id)
  where is_primary;

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  slug extensions.citext not null,
  name text not null,
  environment text not null default 'preview' check (environment in ('preview', 'production', 'staging')),
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, slug)
);

create table public.audit_events (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index organization_memberships_tenant_id_idx
  on public.organization_memberships (tenant_id);

create index organization_memberships_user_id_idx
  on public.organization_memberships (user_id);

create index tenant_domains_tenant_id_idx
  on public.tenant_domains (tenant_id);

create index projects_tenant_id_idx
  on public.projects (tenant_id);

create index audit_events_tenant_id_idx
  on public.audit_events (tenant_id);

create trigger set_organizations_updated_at
before update on public.organizations
for each row
execute function public.set_current_timestamp();

create trigger set_organization_memberships_updated_at
before update on public.organization_memberships
for each row
execute function public.set_current_timestamp();

create trigger set_tenant_domains_updated_at
before update on public.tenant_domains
for each row
execute function public.set_current_timestamp();

create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.set_current_timestamp();

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

alter default privileges in schema public
grant select, insert, update, delete on tables to authenticated, service_role;

alter default privileges in schema public
grant usage, select on sequences to authenticated, service_role;