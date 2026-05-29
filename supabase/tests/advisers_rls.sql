begin;

create extension if not exists pgtap with schema extensions;

select plan(6);

select has_table('public', 'advisers', 'advisers table exists');
select has_column('public', 'advisers', 'tenant_id', 'advisers has tenant_id');
select has_column('public', 'advisers', 'status', 'advisers has status');

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('92000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@salina.dev', extensions.crypt('password123', extensions.gen_salt('bf')), timezone('utc', now()), '{"role": "system_admin"}'::jsonb, '{}'::jsonb, timezone('utc', now()), timezone('utc', now())),
  ('92000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'user@salina.dev', extensions.crypt('password123', extensions.gen_salt('bf')), timezone('utc', now()), '{}'::jsonb, '{}'::jsonb, timezone('utc', now()), timezone('utc', now()));

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"92000000-0000-0000-0000-000000000001","app_metadata":{"role":"system_admin"}}';

select lives_ok(
  $$
    insert into public.advisers (id, name, email, organization_name, status)
    values ('93000000-0000-0000-0000-000000000001', 'Admin Adviser 1', 'adviser1@salina.dev', 'Org 1', 'approved')
  $$,
  'platform admin can insert approved adviser'
);

select lives_ok(
  $$
    insert into public.advisers (id, name, email, organization_name, status)
    values ('93000000-0000-0000-0000-000000000002', 'Admin Adviser 2', 'adviser2@salina.dev', 'Org 2', 'pending')
  $$,
  'platform admin can insert pending adviser'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"92000000-0000-0000-0000-000000000002","app_metadata":{}}';

select results_eq(
  'select id from public.advisers',
  array['93000000-0000-0000-0000-000000000001'::uuid],
  'normal user can only view approved advisers'
);

select * from finish();
rollback;
