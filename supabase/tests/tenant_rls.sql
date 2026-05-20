begin;

create extension if not exists pgtap with schema extensions;

select plan(15);

select has_table('public', 'organizations', 'organizations table exists');
select has_column('public', 'organization_memberships', 'tenant_id', 'organization_memberships has tenant_id');
select has_column('public', 'projects', 'tenant_id', 'projects has tenant_id');
select policies_are(
  'public',
  'projects',
  array['projects_tenant_isolation']
);
select has_table('public', 'organization_roles', 'organization_roles table exists');

insert into public.organizations (id, slug, name)
values
  ('90000000-0000-0000-0000-000000000001', 'tenant-one', 'Tenant One'),
  ('90000000-0000-0000-0000-000000000002', 'tenant-two', 'Tenant Two');

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '90000000-0000-0000-0000-000000000011',
    'authenticated',
    'authenticated',
    'tenant-one@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '90000000-0000-0000-0000-000000000001'),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '90000000-0000-0000-0000-000000000022',
    'authenticated',
    'authenticated',
    'tenant-two@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '90000000-0000-0000-0000-000000000002'),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '90000000-0000-0000-0000-000000000033',
    'authenticated',
    'authenticated',
    'tenant-one-member@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '90000000-0000-0000-0000-000000000001'),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  );

insert into public.organization_memberships (tenant_id, user_id, role)
values
  ('90000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000011', 'admin'),
  ('90000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000022', 'admin'),
  ('90000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000033', 'member');

insert into public.projects (id, tenant_id, slug, name, environment, created_by)
values
  (
    '90000000-0000-0000-0000-000000000033',
    '90000000-0000-0000-0000-000000000001',
    'tenant-one-app',
    'Tenant One App',
    'preview',
    '90000000-0000-0000-0000-000000000011'
  ),
  (
    '90000000-0000-0000-0000-000000000044',
    '90000000-0000-0000-0000-000000000002',
    'tenant-two-app',
    'Tenant Two App',
    'preview',
    '90000000-0000-0000-0000-000000000022'
  );

insert into public.organization_roles(id, tenant_id, name)
values
  ('80000000-0000-0000-0000-000000000011', '90000000-0000-0000-0000-000000000001', 'Role One'),
  ('80000000-0000-0000-0000-000000000022', '90000000-0000-0000-0000-000000000002', 'Role Two');

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000011","app_metadata":{"tenant_id":"90000000-0000-0000-0000-000000000001"}}';

select results_eq(
  'select count(*)::bigint from public.projects',
  array[1::bigint],
  'tenant one only sees its own project'
);

select lives_ok(
  $$
    insert into public.projects (slug, name, environment)
    values ('tenant-one-second', 'Tenant One Second', 'preview')
  $$,
  'tenant-scoped insert succeeds without manually passing tenant_id'
);

select results_eq(
  'select count(*)::bigint from public.organization_roles',
  array[1::bigint],
  'tenant one only sees its own role'
);

select throws_ok(
  $$
    insert into public.organization_roles (tenant_id, name)
    values ('90000000-0000-0000-0000-000000000002', 'Cross Tenant Hack')
  $$,
  'P0001',
  'cross-tenant write rejected',
  'cross-tenant role insert is blocked by RLS'
);

select results_eq(
  $$
    with touched as (
      update public.organization_roles
      set name = 'Hacked'
      where tenant_id = '90000000-0000-0000-0000-000000000002'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'cross-tenant role updates are blocked by RLS'
);

select results_eq(
  $$
    with touched as (
      delete from public.organization_roles
      where tenant_id = '90000000-0000-0000-0000-000000000002'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'cross-tenant role deletes are blocked by RLS'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000033","app_metadata":{"tenant_id":"90000000-0000-0000-0000-000000000001"}}';

select throws_ok(
  $$
    insert into public.organization_roles (tenant_id, name)
    values ('90000000-0000-0000-0000-000000000001', 'Member Hacks Role')
  $$,
  '42501',
  'new row violates row-level security policy for table "organization_roles"',
  'member without admin rights cannot insert role'
);

select results_eq(
  $$
    with touched as (
      update public.organization_roles
      set name = 'Hacked by Member'
      where tenant_id = '90000000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'member without admin rights cannot update role'
);

select results_eq(
  $$
    with touched as (
      delete from public.organization_roles
      where tenant_id = '90000000-0000-0000-0000-000000000001'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'member without admin rights cannot delete role'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"90000000-0000-0000-0000-000000000022","app_metadata":{"tenant_id":"90000000-0000-0000-0000-000000000002"}}';

select results_eq(
  $$
    with touched as (
      update public.projects
      set name = 'Hacked'
      where slug = 'tenant-one-app'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'cross-tenant updates are blocked by RLS'
);

select * from finish();
rollback;