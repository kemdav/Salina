-- ======================================================================
-- Additional seed data: CIT-U SSG and Tokyo Jujutsu organizations,
-- plus events, announcements, and recruitment entries for ALL tenants.
-- All dates are in the year 2026.
-- ======================================================================

-- ======================================================================
-- New Organization: CIT-U SSG (Cebu Institute of Technology - University
-- Supreme Student Government)
-- ======================================================================

-- email: cit-u-ssg-admin@salina.dev / password: SalinaPreview123!
insert into public.organizations (id, slug, name, plan, billing_email, organization_type, theme_config)
values (
  '20202020-2020-2020-2020-202020202020',
  'cit-u-ssg',
  'CIT-U SSG',
  'starter',
  'cit-u-ssg-admin@salina.dev',
  'Academic Institution',
  jsonb_build_object('primaryColor', '#8b0000', 'fontFamily', 'var(--font-heading), sans-serif')
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  plan = excluded.plan,
  billing_email = excluded.billing_email,
  organization_type = excluded.organization_type,
  theme_config = excluded.theme_config,
  updated_at = timezone('utc', now());

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '20202020-2020-202a-2020-202020202020',
  'authenticated',
  'authenticated',
  'cit-u-ssg-admin@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '20202020-2020-2020-2020-202020202020'
  ),
  jsonb_build_object(
    'display_name', 'SSG President',
    'tenant_slug', 'cit-u-ssg'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '20202020-2020-2011-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'cit-u-ssg-admin@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '20202020-2020-202a-2020-202020202020',
    'email', 'cit-u-ssg-admin@salina.dev',
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
  '20202020-2020-2012-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'owner'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

insert into public.tenant_domains (id, tenant_id, host, is_primary, verified_at)
values (
  '20202020-2020-2013-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  'cit-u-ssg.salina.localhost',
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
  '20202020-2020-2014-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  'cit-u-ssg-preview',
  'CIT-U SSG Preview Workspace',
  'preview',
  jsonb_build_object('theme', 'default', 'features', jsonb_build_array('tenant-routing', 'preview-db')),
  '20202020-2020-202a-2020-202020202020'
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
  '20202020-2020-2015-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'preview.seeded',
  'organization',
  '20202020-2020-2020-2020-202020202020',
  jsonb_build_object('source', 'supabase/seed_additions.sql')
)
on conflict (id) do nothing;

-- ===========================
-- cit-u-ssg officer
-- ===========================
-- email: cit-u-ssg-officer@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '20202020-2020-202b-2020-202020202020',
  'authenticated',
  'authenticated',
  'cit-u-ssg-officer@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '20202020-2020-2020-2020-202020202020'
  ),
  jsonb_build_object(
    'display_name', 'SSG Vice President',
    'tenant_slug', 'cit-u-ssg'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '20202020-2021-202b-2020-202020202020',
  '20202020-2020-202b-2020-202020202020',
  'cit-u-ssg-officer@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '20202020-2020-202b-2020-202020202020',
    'email', 'cit-u-ssg-officer@salina.dev',
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
  '20202020-2022-202b-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202b-2020-202020202020',
  'officer'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ===========================
-- cit-u-ssg member
-- ===========================
-- email: cit-u-ssg-member@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '20202020-2020-202c-2020-202020202020',
  'authenticated',
  'authenticated',
  'cit-u-ssg-member@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '20202020-2020-2020-2020-202020202020'
  ),
  jsonb_build_object(
    'display_name', 'Juan Dela Cruz',
    'tenant_slug', 'cit-u-ssg'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '20202020-2023-202c-2020-202020202020',
  '20202020-2020-202c-2020-202020202020',
  'cit-u-ssg-member@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '20202020-2020-202c-2020-202020202020',
    'email', 'cit-u-ssg-member@salina.dev',
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
  '20202020-2024-202c-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202c-2020-202020202020',
  'member'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ===========================
-- cit-u-ssg viewer
-- ===========================
-- email: cit-u-ssg-viewer@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '20202020-2020-202d-2020-202020202020',
  'authenticated',
  'authenticated',
  'cit-u-ssg-viewer@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '20202020-2020-2020-2020-202020202020'
  ),
  jsonb_build_object(
    'display_name', 'Maria Clara',
    'tenant_slug', 'cit-u-ssg'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '20202020-2025-202d-2020-202020202020',
  '20202020-2020-202d-2020-202020202020',
  'cit-u-ssg-viewer@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '20202020-2020-202d-2020-202020202020',
    'email', 'cit-u-ssg-viewer@salina.dev',
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
  '20202020-2026-202d-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202d-2020-202020202020',
  'viewer'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ======================================================================
-- New Organization: Tokyo Metropolitan Curse Technical College
-- (Jujutsu Kaisen themed)
-- ======================================================================

-- email: tokyo-jujutsu-admin@salina.dev / password: SalinaPreview123!
insert into public.organizations (id, slug, name, plan, billing_email, organization_type, theme_config)
values (
  '21212121-2121-2121-2121-212121212121',
  'tokyo-jujutsu',
  'Tokyo Metropolitan Curse Technical College',
  'starter',
  'tokyo-jujutsu-admin@salina.dev',
  'Academic Institution',
  jsonb_build_object('primaryColor', '#4c1d95', 'fontFamily', 'var(--font-heading), sans-serif')
)
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  plan = excluded.plan,
  billing_email = excluded.billing_email,
  organization_type = excluded.organization_type,
  theme_config = excluded.theme_config,
  updated_at = timezone('utc', now());

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '21212121-2121-212a-2121-212121212121',
  'authenticated',
  'authenticated',
  'tokyo-jujutsu-admin@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '21212121-2121-2121-2121-212121212121'
  ),
  jsonb_build_object(
    'display_name', 'Principal Yaga Masamichi',
    'tenant_slug', 'tokyo-jujutsu'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '21212121-2121-2111-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'tokyo-jujutsu-admin@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '21212121-2121-212a-2121-212121212121',
    'email', 'tokyo-jujutsu-admin@salina.dev',
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
  '21212121-2121-2112-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'owner'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

insert into public.tenant_domains (id, tenant_id, host, is_primary, verified_at)
values (
  '21212121-2121-2113-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  'tokyo-jujutsu.salina.localhost',
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
  '21212121-2121-2114-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  'tokyo-jujutsu-preview',
  'Tokyo Jujutsu Preview Workspace',
  'preview',
  jsonb_build_object('theme', 'default', 'features', jsonb_build_array('tenant-routing', 'preview-db')),
  '21212121-2121-212a-2121-212121212121'
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
  '21212121-2121-2115-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'preview.seeded',
  'organization',
  '21212121-2121-2121-2121-212121212121',
  jsonb_build_object('source', 'supabase/seed_additions.sql')
)
on conflict (id) do nothing;

-- ===========================
-- tokyo-jujutsu officer (Gojo Satoru)
-- ===========================
-- email: tokyo-jujutsu-officer@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '21212121-2121-212b-2121-212121212121',
  'authenticated',
  'authenticated',
  'tokyo-jujutsu-officer@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '21212121-2121-2121-2121-212121212121'
  ),
  jsonb_build_object(
    'display_name', 'Gojo Satoru',
    'tenant_slug', 'tokyo-jujutsu'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '21212121-2121-212b-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'tokyo-jujutsu-officer@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '21212121-2121-212b-2121-212121212121',
    'email', 'tokyo-jujutsu-officer@salina.dev',
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
  '21212121-2122-212b-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'officer'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ===========================
-- tokyo-jujutsu member (Yuji Itadori)
-- ===========================
-- email: tokyo-jujutsu-member@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '21212121-2121-212c-2121-212121212121',
  'authenticated',
  'authenticated',
  'tokyo-jujutsu-member@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '21212121-2121-2121-2121-212121212121'
  ),
  jsonb_build_object(
    'display_name', 'Itadori Yuji',
    'tenant_slug', 'tokyo-jujutsu'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '21212121-2123-212c-2121-212121212121',
  '21212121-2121-212c-2121-212121212121',
  'tokyo-jujutsu-member@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '21212121-2121-212c-2121-212121212121',
    'email', 'tokyo-jujutsu-member@salina.dev',
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
  '21212121-2124-212c-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212c-2121-212121212121',
  'member'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ===========================
-- tokyo-jujutsu viewer (Megumi Fushiguro)
-- ===========================
-- email: tokyo-jujutsu-viewer@salina.dev / password: SalinaPreview123!
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
values (
  '21212121-2121-212d-2121-212121212121',
  'authenticated',
  'authenticated',
  'tokyo-jujutsu-viewer@salina.dev',
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object(
    'tenant_id', '21212121-2121-2121-2121-212121212121'
  ),
  jsonb_build_object(
    'display_name', 'Fushiguro Megumi',
    'tenant_slug', 'tokyo-jujutsu'
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
)
on conflict (id) do update
set
  aud = excluded.aud, role = excluded.role, email = excluded.email,
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

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  '21212121-2125-212d-2121-212121212121',
  '21212121-2121-212d-2121-212121212121',
  'tokyo-jujutsu-viewer@salina.dev',
  'email',
  jsonb_build_object(
    'sub', '21212121-2121-212d-2121-212121212121',
    'email', 'tokyo-jujutsu-viewer@salina.dev',
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
  '21212121-2126-212d-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212d-2121-212121212121',
  'viewer'
)
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ======================================================================
-- Seeded Events for ALL Organizations (2026 dates)
-- ======================================================================

-- ---------- System Admin events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e1111111-e111-e111-e111-e11111111111',
  '11111111-1111-1111-1111-111111111111',
  'Platform Roadmap Review Q3 2026',
  'Quarterly review of the Salina platform roadmap. All platform admins required.',
  'Virtual — Salina HQ',
  '2026-07-15 09:00:00+08',
  '2026-07-15 11:00:00+08'
),
(
  'e1111111-e111-e111-e111-e11111111112',
  '11111111-1111-1111-1111-111111111111',
  'Security Audit Sprint',
  'Annual security audit and penetration testing sprint across all tenant environments.',
  'Virtual — Security War Room',
  '2026-09-01 08:00:00+08',
  '2026-09-03 17:00:00+08'
),
(
  'e1111111-e111-e111-e111-e11111111113',
  '11111111-1111-1111-1111-111111111111',
  'Platform Onboarding Workshop',
  'Workshop for new platform administrators on tenant management and RLS policies.',
  'Salina HQ — Training Room A',
  '2026-08-20 13:00:00+08',
  '2026-08-20 16:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Acme events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Q3 All-Hands Meeting',
  'Quarterly all-hands meeting covering Q2 results and Q3 strategic priorities.',
  'Acme HQ — Main Auditorium',
  '2026-07-10 09:00:00+08',
  '2026-07-10 11:30:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Team Building Retreat 2026',
  'Annual team building retreat. Activities include workshops, outdoor challenges, and strategy sessions.',
  'Acme Mountain Resort',
  '2026-08-14 08:00:00+08',
  '2026-08-16 17:00:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Product Launch: Acme Suite v4',
  'Launch event for the new Acme Suite v4. Demo, Q&A, and celebratory reception.',
  'Acme HQ — Innovation Hall',
  '2026-10-01 10:00:00+08',
  '2026-10-01 14:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e1313131-3131-3131-3131-313131313131',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP Regional Convention 2026',
  'Annual regional convention of ICPEP.SE chapters. Keynote speakers, panel discussions, and networking.',
  'CIT University — Main Campus Auditorium',
  '2026-09-15 08:00:00+08',
  '2026-09-17 17:00:00+08'
),
(
  'e1313131-3131-3131-3131-313131313132',
  '13131313-1313-1313-1313-131313131313',
  'Codewarz 2026',
  'Annual competitive programming competition open to all CIT-U engineering students.',
  'CIT University — Computer Labs Bldg 3',
  '2026-11-10 09:00:00+08',
  '2026-11-10 18:00:00+08'
),
(
  'e1313131-3131-3131-3131-313131313133',
  '13131313-1313-1313-1313-131313131313',
  'General Assembly — 2nd Semester',
  'Second semester general assembly. Officer elections and chapter updates.',
  'CIT University — AVR 1',
  '2026-08-05 13:00:00+08',
  '2026-08-05 16:00:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2020202-2020-2020-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  'Tekno Days 2026',
  'Annual technology festival showcasing student projects, robotics demos, hackathons, and industry talks. Open to all CIT-U colleges.',
  'CIT University — Grand Plaza & AVR Complex',
  '2026-09-22 08:00:00+08',
  '2026-09-24 17:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202021',
  '20202020-2020-2020-2020-202020202020',
  'Intramurals 2026',
  'Inter-college sports competition featuring basketball, volleyball, esports, and cheerdance. College pride on the line!',
  'CIT University — Sports Complex',
  '2026-10-12 07:00:00+08',
  '2026-10-17 18:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202022',
  '20202020-2020-2020-2020-202020202020',
  'Student Org Recruitment Fair',
  'Annual recruitment fair for all accredited student organizations. Find your tribe!',
  'CIT University — Freedom Park',
  '2026-07-20 10:00:00+08',
  '2026-07-22 16:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202023',
  '20202020-2020-2020-2020-202020202020',
  'Leadership Training Seminar',
  'Mandatory leadership training for all SSG officers and student org presidents.',
  'CIT University — AVR 1',
  '2026-08-10 08:00:00+08',
  '2026-08-10 17:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2121212-2121-2121-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  'Kyoto Sister-School Goodwill Event 2026',
  'Annual goodwill exchange event between Tokyo and Kyoto Jujutsu High. Includes team battles, individual sparring, and curse exorcism drills. Supervised by faculty from both schools.',
  'Tokyo Metropolitan Curse Technical College — Training Grounds',
  '2026-08-17 09:00:00+08',
  '2026-08-19 18:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212122',
  '21212121-2121-2121-2121-212121212121',
  'Special Grade Curse Subjugation Briefing',
  'Mandatory briefing for all Grade 1 and above sorcerers. Intelligence report on a suspected Special Grade curse manifestation in the Shinjuku ward. Deployment rotations and barrier protocols to be assigned.',
  'Tokyo Metropolitan Curse Technical College — War Room',
  '2026-07-01 14:00:00+08',
  '2026-07-01 16:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212123',
  '21212121-2121-2121-2121-212121212121',
  'Veil & Barrier Maintenance Drill',
  'Quarterly maintenance and reinforcement of the protective barriers surrounding the Tokyo school grounds. All first and second year students required to participate.',
  'Tokyo Metropolitan Curse Technical College — Perimeter',
  '2026-09-05 06:00:00+08',
  '2026-09-05 12:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212124',
  '21212121-2121-2121-2121-212121212121',
  'Cursed Tool Exhibition',
  'Exhibition of newly acquired and student-forged cursed tools. Open to all sorcerers. Special demonstration by Maki Zenin on cursed tool resonance.',
  'Tokyo Metropolitan Curse Technical College — Armory Hall',
  '2026-11-03 10:00:00+08',
  '2026-11-03 15:00:00+08'
)
on conflict (id) do nothing;

-- ======================================================================
-- Seeded Announcements for ALL Organizations (2026)
-- ======================================================================

-- ---------- System Admin announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Platform v2.5 Release — June 2026',
  'We are pleased to announce the rollout of Salina Platform v2.5. Key improvements include enhanced tenant isolation, faster dashboard queries, and new QR attendance scanning for events. All tenant environments will be progressively updated throughout June. Please review the changelog for breaking changes.',
  'Platform',
  '2026-06-01 09:00:00+08'
),
(
  'a1111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Scheduled Maintenance — August 15',
  'Salina will undergo scheduled maintenance on August 15, 2026 from 02:00 to 06:00 UTC+8. During this window, tenant dashboards and authentication services may experience brief interruptions. No data loss is expected.',
  'Platform',
  '2026-08-01 10:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Acme announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'New Remote Work Policy Effective July 2026',
  'Starting July 1, 2026, Acme is transitioning to a hybrid work model. Employees are expected to be on-site at least 2 days per week. Department heads will coordinate team schedules. Please review the full policy document in the Documents section.',
  'Policy',
  '2026-06-15 09:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Acme Wellness Program Launch',
  'We are excited to launch the Acme Wellness Program! All employees now have access to gym subsidies, mental health counseling, and weekly yoga sessions. Sign up through the HR portal.',
  'General',
  '2026-05-20 14:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1131313-1313-1313-1313-131313131313',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Call for Papers — ICPEP Research Symposium 2026',
  'The ICPEP.SE chapter is now accepting research paper submissions for the 2026 Research Symposium. Topics include software engineering, AI/ML, embedded systems, and cybersecurity. Submission deadline: September 30, 2026.',
  'Academic',
  '2026-08-01 08:00:00+08'
),
(
  'a1131313-1313-1313-1313-131313131314',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Membership Dues for AY 2026-2027',
  'Please settle your membership dues for Academic Year 2026-2027 on or before July 31, 2026. Dues cover chapter operations, event funding, and national ICPEP affiliation. Payment can be made through the organization dashboard.',
  'Finance',
  '2026-06-01 10:00:00+08'
),
(
  'a1131313-1313-1313-1313-131313131315',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Congratulations to the 2026 Board Exam Passers!',
  'Congratulations to all CIT-U engineering graduates who passed the 2026 licensure examinations! Your ICPEP.SE family is proud of you. A testimonial dinner will be held on August 25.',
  'General',
  '2026-07-15 16:00:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1202020-2020-2020-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'SSG Freshmen Welcome Assembly',
  'Welcome to CIT University, freshmen! The Supreme Student Government invites all first-year students to the Freshmen Welcome Assembly on July 6, 2026 at the Main Auditorium. Meet your SSG officers, learn about student services, and get your free Tekno Kit!',
  'General',
  '2026-06-25 08:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202021',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Campus Wi-Fi Upgrade — New SSID',
  'The ICT Department has completed the campus Wi-Fi upgrade. The new SSID is CITU-Student-2026. Use your student portal credentials to log in. Bandwidth per user has been increased to 50 Mbps. Report connectivity issues via the SSG Help Desk.',
  'Campus Advisory',
  '2026-07-01 09:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202022',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Student Org Accreditation Renewal',
  'All student organizations must renew their accreditation for AY 2026-2027 by August 15, 2026. Submit your accomplishment reports, financial statements, and proposed activity calendar. Late submissions will not be processed.',
  'Policy',
  '2026-07-10 10:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202023',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Intramurals Team Registration Now Open',
  'Team registration for Intramurals 2026 is now open! Colleges may field teams in Basketball, Volleyball, Esports (Valorant & MLBB), Chess, and Cheerdance. Registration closes September 25. Team captains meeting on September 28.',
  'Sports',
  '2026-09-01 08:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1212121-2121-2121-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'Notice from the Principal: New Sorcerer Rankings',
  'Effective immediately, the new sorcerer ranking assessment criteria are in effect. All students will undergo re-evaluation during the upcoming practical examinations. Semi-Grade 1 promotions are on hold pending Jujutsu Headquarters review. — Principal Yaga Masamichi',
  'Official',
  '2026-06-01 08:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212122',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'URGENT: Curtain Protocol Reminder',
  'This is a reminder to ALL sorcerers: always deploy a Curtain before engaging in combat within populated areas. Leaving curses visible to non-sorcerers is a violation of Jujutsu Regulations Article 7. Repeated offenses will result in disciplinary action.',
  'Regulation',
  '2026-07-05 14:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212123',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'A Message from Gojo Satoru',
  'Yo! If you see a tall guy with a blindfold around campus, that is me. Do not be shy — say hi! Also, I left some souvenir Kikufuku in the faculty lounge. First come, first served. Oh, and Megumi — stop brooding in the corner during missions. That is an order from your sensei! ✨',
  'General',
  '2026-08-12 11:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212124',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'Curse-Human Relations Protocol Update',
  'Pursuant to the Shinjuku Incident investigation, the College is updating its protocols regarding curse-human coexistence cases. All personnel are reminded that vessels (such as Itadori Yuji) are to be treated as allies, not threats. Any violation will be met with severe consequences. — By order of the Principal',
  'Policy',
  '2026-09-20 09:00:00+08'
)
on conflict (id) do nothing;

-- ======================================================================
-- Seeded Recruitment Entries (2026)
-- ======================================================================

-- CIT-U SSG: active recruitment
insert into public.recruitment_entries (id, tenant_id, title, description, status, created_by, settings, created_at)
values
(
  'a2202020-2020-2020-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  'SSG First-Year Representative Application',
  'The Supreme Student Government is looking for passionate first-year students to serve as batch representatives. Help shape campus policies and represent your college! Open to all BS and non-BS programs.',
  'published',
  '20202020-2020-202a-2020-202020202020',
  jsonb_build_object('stages', jsonb_build_array(
    jsonb_build_object('id', 'stage-1', 'name', 'Application Form', 'type', 'form'),
    jsonb_build_object('id', 'stage-2', 'name', 'Panel Interview', 'type', 'interview'),
    jsonb_build_object('id', 'stage-3', 'name', 'Final Deliberation', 'type', 'review')
  )),
  '2026-08-01 08:00:00+08'
),
(
  'a2202020-2020-2020-2020-202020202021',
  '20202020-2020-2020-2020-202020202020',
  'Tekno Days 2026 Volunteer Crew',
  'Join the Tekno Days organizing team! We need volunteers for logistics, registration, stage management, and social media coverage. Perks include free event merch, certificate of service, and priority access to workshops.',
  'published',
  '20202020-2020-202a-2020-202020202020',
  jsonb_build_object('stages', jsonb_build_array(
    jsonb_build_object('id', 'stage-1', 'name', 'Sign Up', 'type', 'form'),
    jsonb_build_object('id', 'stage-2', 'name', 'Orientation', 'type', 'meeting')
  )),
  '2026-07-01 08:00:00+08'
)
on conflict (id) do nothing;

-- Tokyo Jujutsu: recruitment entries
insert into public.recruitment_entries (id, tenant_id, title, description, status, created_by, settings, created_at)
values
(
  'a2212121-2121-2121-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  'First-Year Sorcerer Enrollment — Fall 2026',
  'Jujutsu High is accepting applications for the Fall 2026 intake. Applicants must demonstrate at least Grade 3 curse energy manipulation. Those with innate techniques will be prioritized. Recommendation from an accredited sorcerer required.',
  'published',
  '21212121-2121-212a-2121-212121212121',
  jsonb_build_object('stages', jsonb_build_array(
    jsonb_build_object('id', 'stage-1', 'name', 'Curse Energy Assessment', 'type', 'practical'),
    jsonb_build_object('id', 'stage-2', 'name', 'Written Examination', 'type', 'exam'),
    jsonb_build_object('id', 'stage-3', 'name', 'Interview with Faculty', 'type', 'interview')
  )),
  '2026-06-01 08:00:00+08'
),
(
  'a2212121-2121-2121-2121-212121212122',
  '21212121-2121-2121-2121-212121212121',
  'Assistant Curse Technician Position',
  'The Tokyo school is hiring an Assistant Curse Technician to maintain and catalogue cursed tools in the armory. Experience with cursed corpse animation is a plus. Report directly to Principal Yaga.',
  'published',
  '21212121-2121-212a-2121-212121212121',
  jsonb_build_object('stages', jsonb_build_array(
    jsonb_build_object('id', 'stage-1', 'name', 'Application Review', 'type', 'review'),
    jsonb_build_object('id', 'stage-2', 'name', 'Practical Demonstration', 'type', 'practical')
  )),
  '2026-07-15 08:00:00+08'
)
on conflict (id) do nothing;

-- ======================================================================
-- Seed Digital IDs for all new memberships
-- ======================================================================
insert into public.digital_ids (tenant_id, membership_id)
select tenant_id, id from public.organization_memberships
where tenant_id in (
  '20202020-2020-2020-2020-202020202020',
  '21212121-2121-2121-2121-212121212121'
)
on conflict (tenant_id, membership_id) do nothing;

-- ======================================================================
-- Seeded Event Attendees (2026)
-- ======================================================================

-- Acme Q3 All-Hands attendees
insert into public.event_attendees (id, tenant_id, event_id, member_id, status, check_in_time)
values
(
  'a0aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Verified',
  '2026-07-10 08:45:00+08'
),
(
  'a0aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'dddddddd-dddd-dddd-aadd-dddddddddddd',
  'Verified',
  '2026-07-10 08:50:00+08'
)
on conflict (id) do nothing;

-- ICPEP.SE General Assembly attendees
insert into public.event_attendees (id, tenant_id, event_id, member_id, status, check_in_time)
values
(
  'a0131313-1313-1313-1313-131313131313',
  '13131313-1313-1313-1313-131313131313',
  'e1313131-3131-3131-3131-313131313133',
  '16161616-1616-1616-1616-161616161616',
  'Verified',
  '2026-08-05 12:50:00+08'
),
(
  'a0131313-1313-1313-1313-131313131314',
  '13131313-1313-1313-1313-131313131313',
  'e1313131-3131-3131-3131-313131313133',
  '16161616-1616-161a-1616-161616161616',
  'Verified',
  '2026-08-05 13:00:00+08'
),
(
  'a0131313-1313-1313-1313-131313131315',
  '13131313-1313-1313-1313-131313131313',
  'e1313131-3131-3131-3131-313131313133',
  '16161616-1616-161b-1616-161616161616',
  'Verified',
  '2026-08-05 13:05:00+08'
)
on conflict (id) do nothing;

-- CIT-U SSG Leadership Training attendees
insert into public.event_attendees (id, tenant_id, event_id, member_id, status, check_in_time)
values
(
  'a0202020-2020-2020-2020-202020202020',
  '20202020-2020-2020-2020-202020202020',
  'e2020202-2020-2020-2020-202020202023',
  '20202020-2020-2012-2020-202020202020',
  'Verified',
  '2026-08-10 07:45:00+08'
),
(
  'a0202020-2020-2020-2020-202020202021',
  '20202020-2020-2020-2020-202020202020',
  'e2020202-2020-2020-2020-202020202023',
  '20202020-2022-202b-2020-202020202020',
  'Verified',
  '2026-08-10 07:50:00+08'
)
on conflict (id) do nothing;

-- Tokyo Jujutsu: Special Grade Curse briefing attendees
insert into public.event_attendees (id, tenant_id, event_id, member_id, status, check_in_time)
values
(
  'a0212121-2121-2121-2121-212121212121',
  '21212121-2121-2121-2121-212121212121',
  'e2121212-2121-2121-2121-212121212122',
  '21212121-2121-2112-2121-212121212121',
  'Verified',
  '2026-07-01 13:50:00+08'
),
(
  'a0212121-2121-2121-2121-212121212122',
  '21212121-2121-2121-2121-212121212121',
  'e2121212-2121-2121-2121-212121212122',
  '21212121-2122-212b-2121-212121212121',
  'Verified',
  '2026-07-01 13:55:00+08'
),
(
  'a0212121-2121-2121-2121-212121212123',
  '21212121-2121-2121-2121-212121212121',
  'e2121212-2121-2121-2121-212121212122',
  '21212121-2124-212c-2121-212121212121',
  'Verified',
  '2026-07-01 14:00:00+08'
)
on conflict (id) do nothing;
