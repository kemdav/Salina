begin;

create extension if not exists pgtap with schema extensions;

select plan(5);

select has_table('public', 'recruitment_entries', 'recruitment_entries table exists');
select has_column('public', 'recruitment_entries', 'tenant_id', 'recruitment_entries has tenant_id');
select policies_are(
  'public',
  'recruitment_entries',
  array['tenant_isolation']
);

insert into public.organizations (id, slug, name)
values
  ('92000000-0000-0000-0000-000000000001', 'tenant-one', 'Tenant One'),
  ('92000000-0000-0000-0000-000000000002', 'tenant-two', 'Tenant Two');

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
    '92000000-0000-0000-0000-000000000011',
    'authenticated',
    'authenticated',
    'tenant-one@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '92000000-0000-0000-0000-000000000001', 'temporary_applicant', true),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '92000000-0000-0000-0000-000000000022',
    'authenticated',
    'authenticated',
    'tenant-two@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '92000000-0000-0000-0000-000000000002', 'temporary_applicant', true),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  );

insert into public.recruitment_entries (
  id,
  tenant_id,
  title,
  status,
  created_by
)
values
  (
    '92000000-0000-0000-0000-000000000033',
    '92000000-0000-0000-0000-000000000001',
    'Tenant One Recruitment',
    'draft',
    null
  ),
  (
    '92000000-0000-0000-0000-000000000044',
    '92000000-0000-0000-0000-000000000002',
    'Tenant Two Recruitment',
    'draft',
    null
  );

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"92000000-0000-0000-0000-000000000011","app_metadata":{"tenant_id":"92000000-0000-0000-0000-000000000001"}}';

select results_eq(
  'select count(*)::bigint from public.recruitment_entries',
  array[1::bigint],
  'tenant one only sees its own recruitment entries'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"92000000-0000-0000-0000-000000000022","app_metadata":{"tenant_id":"92000000-0000-0000-0000-000000000002"}}';

select results_eq(
  $$
    with touched as (
      update public.recruitment_entries
      set title = 'Hacked'
      where id = '92000000-0000-0000-0000-000000000033'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'cross-tenant updates are blocked by RLS'
);

select * from finish();
rollback;
