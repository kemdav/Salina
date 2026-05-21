begin;

create extension if not exists pgtap with schema extensions;

select plan(9);

select has_table('public', 'events', 'events table exists');
select has_table('public', 'event_attendees', 'event_attendees table exists');

select policies_are(
  'public',
  'events',
  array['events_tenant_isolation_select', 'events_tenant_isolation_insert', 'events_tenant_isolation_update', 'events_tenant_isolation_delete']
);

select policies_are(
  'public',
  'event_attendees',
  array['event_attendees_isolation_select', 'event_attendees_isolation_insert', 'event_attendees_isolation_update', 'event_attendees_isolation_delete']
);

insert into public.organizations (id, slug, name)
values
  ('81000000-0000-0000-0000-000000000001', 'tenant-one', 'Tenant One'),
  ('81000000-0000-0000-0000-000000000002', 'tenant-two', 'Tenant Two');

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('81000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'tenant-one@test.salina.dev', extensions.crypt('password123', extensions.gen_salt('bf')), timezone('utc', now()), jsonb_build_object('tenant_id', '81000000-0000-0000-0000-000000000001'), '{}'::jsonb, timezone('utc', now()), timezone('utc', now())),
  ('81000000-0000-0000-0000-000000000015', 'authenticated', 'authenticated', 'tenant-one-officer@test.salina.dev', extensions.crypt('password123', extensions.gen_salt('bf')), timezone('utc', now()), jsonb_build_object('tenant_id', '81000000-0000-0000-0000-000000000001'), '{}'::jsonb, timezone('utc', now()), timezone('utc', now())),
  ('81000000-0000-0000-0000-000000000022', 'authenticated', 'authenticated', 'tenant-two@test.salina.dev', extensions.crypt('password123', extensions.gen_salt('bf')), timezone('utc', now()), jsonb_build_object('tenant_id', '81000000-0000-0000-0000-000000000002'), '{}'::jsonb, timezone('utc', now()), timezone('utc', now()));

insert into public.organization_memberships (id, tenant_id, user_id, role)
values
  ('81000000-0000-0000-0000-000000000031', '81000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000011', 'member'),
  ('81000000-0000-0000-0000-000000000032', '81000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000015', 'officer'),
  ('81000000-0000-0000-0000-000000000033', '81000000-0000-0000-0000-000000000002', '81000000-0000-0000-0000-000000000022', 'member');

insert into public.events (id, tenant_id, title, location, start_time, end_time)
values
  ('81000000-0000-0000-0000-000000000041', '81000000-0000-0000-0000-000000000001', 'Tenant One Event', 'Location 1', timezone('utc', now()), timezone('utc', now())),
  ('81000000-0000-0000-0000-000000000042', '81000000-0000-0000-0000-000000000002', 'Tenant Two Event', 'Location 2', timezone('utc', now()), timezone('utc', now()));

insert into public.event_attendees (id, tenant_id, event_id, member_id, status)
values
  ('81000000-0000-0000-0000-000000000051', '81000000-0000-0000-0000-000000000001', '81000000-0000-0000-0000-000000000041', '81000000-0000-0000-0000-000000000031', 'Pending'),
  ('81000000-0000-0000-0000-000000000052', '81000000-0000-0000-0000-000000000002', '81000000-0000-0000-0000-000000000042', '81000000-0000-0000-0000-000000000033', 'Pending');

set local role authenticated;
set local "request.jwt.claims" = '{"role":"authenticated","sub":"81000000-0000-0000-0000-000000000011","app_metadata":{"tenant_id":"81000000-0000-0000-0000-000000000001"}}';

select results_eq(
  'select count(*)::bigint from public.events',
  array[1::bigint],
  'tenant one only sees its own events'
);

select results_eq(
  'select count(*)::bigint from public.event_attendees',
  array[1::bigint],
  'tenant one regular member sees own attendance records'
);

select results_eq(
  $$
    with touched as (
      update public.events
      set title = 'Hacked Event'
      where id = '81000000-0000-0000-0000-000000000041'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'regular members cannot update events'
);

set local "request.jwt.claims" = '{"role":"authenticated","sub":"81000000-0000-0000-0000-000000000015","app_metadata":{"tenant_id":"81000000-0000-0000-0000-000000000001"}}';

select lives_ok(
  $$
    update public.events
    set title = 'Officer Updated Event'
    where id = '81000000-0000-0000-0000-000000000041'
  $$,
  'officer can update own tenant events'
);

select results_eq(
  $$
    with touched as (
      update public.events
      set title = 'Hacked Event'
      where id = '81000000-0000-0000-0000-000000000042'
      returning id
    )
    select count(*)::bigint from touched
  $$,
  array[0::bigint],
  'officer cross-tenant updates are blocked by RLS'
);

select * from finish();
rollback;
