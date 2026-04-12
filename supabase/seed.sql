-- Preview/local-only credentials:
-- email: system-admin@salina.dev
-- password: SalinaPreview123!

insert into public.organizations (id, slug, name, plan, billing_email)
values (
  '11111111-1111-1111-1111-111111111111',
  'system-admin',
  'System Admin',
  'system',
  'system-admin@salina.dev'
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  plan = excluded.plan,
  billing_email = excluded.billing_email,
  updated_at = timezone('utc', now());

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
  updated_at,
  instance_id,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  reauthentication_token
)
values (
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'system-admin@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '11111111-1111-1111-1111-111111111111',
    'roles', jsonb_build_array('system_admin')
  ),
  jsonb_build_object(
    'display_name', 'System Admin',
    'tenant_slug', 'system-admin'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  instance_id = excluded.instance_id,
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  email_change_token_current = excluded.email_change_token_current,
  reauthentication_token = excluded.reauthentication_token,
  updated_at = timezone('utc', now());

insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'system-admin@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '22222222-2222-2222-2222-222222222222',
    'email', 'system-admin@salina.dev',
    'email_verified', true
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

insert into public.organization_memberships (id, tenant_id, user_id, role)
values (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'system_admin'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

insert into public.tenant_domains (id, tenant_id, host, is_primary, verified_at)
values (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'system-admin.localhost',
  true,
  timezone('utc', now())
)
on conflict (host) do update
set
  tenant_id = excluded.tenant_id,
  is_primary = excluded.is_primary,
  verified_at = excluded.verified_at,
  updated_at = timezone('utc', now());

insert into public.projects (id, tenant_id, slug, name, environment, settings, created_by)
values (
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'salina-preview',
  'Salina Preview Workspace',
  'preview',
  jsonb_build_object('theme', 'default', 'features', jsonb_build_array('tenant-routing', 'preview-db')),
  '22222222-2222-2222-2222-222222222222'
)
on conflict (tenant_id, slug) do update
set
  name = excluded.name,
  environment = excluded.environment,
  settings = excluded.settings,
  created_by = excluded.created_by,
  updated_at = timezone('utc', now());

insert into public.audit_events (id, tenant_id, actor_user_id, action, entity_type, entity_id, payload)
values (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'preview.seeded',
  'organization',
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object('source', 'supabase/seed.sql')
)
on conflict (id) do nothing;

-- Preview/local-only credentials:
-- email: acme-admin@salina.dev
-- password: SalinaPreview123!

insert into public.organizations (id, slug, name, plan, billing_email)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'acme',
  'Acme',
  'starter',
  'acme-admin@salina.dev'
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  plan = excluded.plan,
  billing_email = excluded.billing_email,
  updated_at = timezone('utc', now());

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
  updated_at,
  instance_id,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  reauthentication_token
)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'authenticated',
  'authenticated',
  'acme-admin@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  ),
  jsonb_build_object(
    'display_name', 'Acme Admin',
    'tenant_slug', 'acme'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  instance_id = excluded.instance_id,
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  email_change_token_current = excluded.email_change_token_current,
  reauthentication_token = excluded.reauthentication_token,
  updated_at = timezone('utc', now());

insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'acme-admin@salina.dev',
  'email',
  jsonb_build_object(
    'sub', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'email', 'acme-admin@salina.dev',
    'email_verified', true
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

insert into public.organization_memberships (id, tenant_id, user_id, role)
values (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'owner'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

insert into public.tenant_domains (id, tenant_id, host, is_primary, verified_at)
values (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'acme.localhost',
  true,
  timezone('utc', now())
)
on conflict (host) do update
set
  tenant_id = excluded.tenant_id,
  is_primary = excluded.is_primary,
  verified_at = excluded.verified_at,
  updated_at = timezone('utc', now());

insert into public.projects (id, tenant_id, slug, name, environment, settings, created_by)
values (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'acme-preview',
  'Acme Preview Workspace',
  'preview',
  jsonb_build_object('theme', 'default', 'features', jsonb_build_array('tenant-routing', 'preview-db')),
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
)
on conflict (tenant_id, slug) do update
set
  name = excluded.name,
  environment = excluded.environment,
  settings = excluded.settings,
  created_by = excluded.created_by,
  updated_at = timezone('utc', now());

insert into public.audit_events (id, tenant_id, actor_user_id, action, entity_type, entity_id, payload)
values (
  '12121212-1212-1212-1212-121212121212',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'preview.seeded',
  'organization',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  jsonb_build_object('source', 'supabase/seed.sql')
)
on conflict (id) do nothing;

-- Preview/local-only credentials:
-- email: icpep-se-admin@salina.dev
-- password: SalinaPreview123!

insert into public.organizations (id, slug, name, plan, billing_email)
values (
  '13131313-1313-1313-1313-131313131313',
  'icpep-se',
  'ICPEP.SE - CIT University',
  'starter',
  'icpep-se-admin@salina.dev'
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  plan = excluded.plan,
  billing_email = excluded.billing_email,
  updated_at = timezone('utc', now());

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
  updated_at,
  instance_id,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  phone_change,
  phone_change_token,
  email_change_token_current,
  reauthentication_token
)
values (
  '14141414-1414-1414-1414-141414141414',
  'authenticated',
  'authenticated',
  'icpep-se-admin@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '13131313-1313-1313-1313-131313131313'
  ),
  jsonb_build_object(
    'display_name', 'ICPEP.SE Admin',
    'tenant_slug', 'icpep-se'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud,
  role = excluded.role,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  instance_id = excluded.instance_id,
  confirmation_token = excluded.confirmation_token,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  email_change_token_current = excluded.email_change_token_current,
  reauthentication_token = excluded.reauthentication_token,
  updated_at = timezone('utc', now());

insert into auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '15151515-1515-1515-1515-151515151515',
  '14141414-1414-1414-1414-141414141414',
  'icpep-se-admin@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '14141414-1414-1414-1414-141414141414',
    'email', 'icpep-se-admin@salina.dev',
    'email_verified', true
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

insert into public.organization_memberships (id, tenant_id, user_id, role)
values (
  '16161616-1616-1616-1616-161616161616',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'owner'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

insert into public.tenant_domains (id, tenant_id, host, is_primary, verified_at)
values (
  '17171717-1717-1717-1717-171717171717',
  '13131313-1313-1313-1313-131313131313',
  'icpep-se.localhost',
  true,
  timezone('utc', now())
)
on conflict (host) do update
set
  tenant_id = excluded.tenant_id,
  is_primary = excluded.is_primary,
  verified_at = excluded.verified_at,
  updated_at = timezone('utc', now());

insert into public.projects (id, tenant_id, slug, name, environment, settings, created_by)
values (
  '18181818-1818-1818-1818-181818181818',
  '13131313-1313-1313-1313-131313131313',
  'icpep-se-preview',
  'ICPEP.SE Preview Workspace',
  'preview',
  jsonb_build_object('theme', 'default', 'features', jsonb_build_array('tenant-routing', 'preview-db')),
  '14141414-1414-1414-1414-141414141414'
)
on conflict (tenant_id, slug) do update
set
  name = excluded.name,
  environment = excluded.environment,
  settings = excluded.settings,
  created_by = excluded.created_by,
  updated_at = timezone('utc', now());

insert into public.audit_events (id, tenant_id, actor_user_id, action, entity_type, entity_id, payload)
values (
  '19191919-1919-1919-1919-191919191919',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'preview.seeded',
  'organization',
  '13131313-1313-1313-1313-131313131313',
  jsonb_build_object('source', 'supabase/seed.sql')
)
on conflict (id) do nothing;