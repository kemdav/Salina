begin;

create extension if not exists pgtap with schema extensions;

select plan(7);

select has_table('public', 'organizations', 'organizations table exists');
select has_column('public', 'organization_memberships', 'tenant_id', 'organization_memberships has tenant_id');
select has_column('public', 'projects', 'tenant_id', 'projects has tenant_id');
select policies_are(
  'public',
  'projects',
  array['projects_tenant_isolation']
);

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
  );

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