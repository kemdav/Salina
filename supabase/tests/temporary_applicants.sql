begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

select has_table('public', 'temporary_applicants', 'temporary_applicants table exists');
select has_column('public', 'temporary_applicants', 'tenant_id', 'temporary_applicants has tenant_id');
select has_column('public', 'temporary_applicants', 'invite_token', 'temporary_applicants has invite_token');
select has_column('public', 'temporary_applicants', 'status', 'temporary_applicants has status');
select policies_are(
  'public',
  'temporary_applicants',
  array['temporary_applicants_tenant_isolation']
);

insert into public.organizations (id, slug, name)
values
  ('91000000-0000-0000-0000-000000000001', 'tenant-one', 'Tenant One'),
  ('91000000-0000-0000-0000-000000000002', 'tenant-two', 'Tenant Two');

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
    '91000000-0000-0000-0000-000000000011',
    'authenticated',
    'authenticated',
    'tenant-one@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '91000000-0000-0000-0000-000000000001', 'temporary_applicant', true),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '91000000-0000-0000-0000-000000000022',
    'authenticated',
    'authenticated',
    'tenant-two@test.salina.dev',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc', now()),
    jsonb_build_object('tenant_id', '91000000-0000-0000-0000-000000000002', 'temporary_applicant', true),
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  );

insert into public.temporary_applicants (
  id,
  tenant_id,
  applicant_name,
  applicant_email,
  applicant_user_id,
  status
)
values
  (
    '91000000-0000-0000-0000-000000000033',
    '91000000-0000-0000-0000-000000000001',
    'Tenant One Applicant',
    'tenant-one@test.salina.dev',
    '91000000-0000-0000-0000-000000000011',
    'submitted'
  ),
  (
    '91000000-0000-0000-0000-000000000044',
    '91000000-0000-0000-0000-000000000002',
    'Tenant Two Applicant',
    'tenant-two@test.salina.dev',
    '91000000-0000-0000-0000-000000000022',
    'submitted'
  );

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"91000000-0000-0000-0000-000000000011","app_metadata":{"tenant_id":"91000000-0000-0000-0000-000000000001"}}';

select results_eq(
  'select count(*)::bigint from public.temporary_applicants',
  array[1::bigint],
  'tenant one only sees its own temporary applicant'
);

select lives_ok(
  $$
    insert into public.temporary_applicants (applicant_name, applicant_email)
    values ('Tenant One Applicant 2', 'tenant-one-two@test.salina.dev')
  $$,
  'tenant-scoped insert succeeds without manually passing tenant_id'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"91000000-0000-0000-0000-000000000022","app_metadata":{"tenant_id":"91000000-0000-0000-0000-000000000002"}}';

select results_eq(
  $$
    with touched as (
      update public.temporary_applicants
      set applicant_name = 'Hacked'
      where id = '91000000-0000-0000-0000-000000000033'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'cross-tenant updates are blocked by RLS'
);

select * from finish();
rollback;