-- ======================================================================
-- Additional roster seed data for Acme, ICPEP.SE, CIT-U SSG, and Tokyo Jujutsu
-- Ensures each org has at least 2 officers and 10 members.
-- ======================================================================

-- CIT-U SSG roster
with roster as (
  select *
  from (values
    ('20202020-2020-20e0-2020-202020202020'::uuid, 'cit-u-ssg-admin@salina.dev', 'CIT-U SSG Owner', 'owner'),
    ('20202020-2020-20e1-2020-202020202020'::uuid, 'cit-u-ssg-mia-santos@salina.dev', 'Mia Santos', 'officer'),
    ('20202020-2020-20e2-2020-202020202020'::uuid, 'cit-u-ssg-paolo-mercado@salina.dev', 'Paolo Mercado', 'officer'),
    ('20202020-2020-20e3-2020-202020202020'::uuid, 'cit-u-ssg-jessa-lim@salina.dev', 'Jessa Mae Lim', 'member'),
    ('20202020-2020-20e4-2020-202020202020'::uuid, 'cit-u-ssg-kyle-fernandez@salina.dev', 'Kyle Fernandez', 'member'),
    ('20202020-2020-20e5-2020-202020202020'::uuid, 'cit-u-ssg-rhea-castillo@salina.dev', 'Rhea Castillo', 'member'),
    ('20202020-2020-20e6-2020-202020202020'::uuid, 'cit-u-ssg-ivan-dacera@salina.dev', 'Ivan Dacera', 'member'),
    ('20202020-2020-20e7-2020-202020202020'::uuid, 'cit-u-ssg-sofia-alcoran@salina.dev', 'Sofia Alcoran', 'member'),
    ('20202020-2020-20e8-2020-202020202020'::uuid, 'cit-u-ssg-trisha-gomez@salina.dev', 'Trisha Gomez', 'member'),
    ('20202020-2020-20e9-2020-202020202020'::uuid, 'cit-u-ssg-alvin-navarro@salina.dev', 'Alvin Navarro', 'member'),
    ('20202020-2020-20ea-2020-202020202020'::uuid, 'cit-u-ssg-mae-dizon@salina.dev', 'Mae Dizon', 'member'),
    ('20202020-2020-20eb-2020-202020202020'::uuid, 'cit-u-ssg-nico-villanueva@salina.dev', 'Nico Villanueva', 'member'),
    ('20202020-2020-20ec-2020-202020202020'::uuid, 'cit-u-ssg-angel-reyes@salina.dev', 'Angel Reyes', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
select
  user_id,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object('tenant_id', '20202020-2020-2020-2020-202020202020'),
  jsonb_build_object('display_name', display_name, 'tenant_slug', 'cit-u-ssg'),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
from roster
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

with roster as (
  select *
  from (values
    ('20202020-2020-20e0-2020-202020202020'::uuid, 'cit-u-ssg-admin@salina.dev', 'CIT-U SSG Owner', 'owner'),
    ('20202020-2020-20e1-2020-202020202020'::uuid, 'cit-u-ssg-mia-santos@salina.dev', 'Mia Santos', 'officer'),
    ('20202020-2020-20e2-2020-202020202020'::uuid, 'cit-u-ssg-paolo-mercado@salina.dev', 'Paolo Mercado', 'officer'),
    ('20202020-2020-20e3-2020-202020202020'::uuid, 'cit-u-ssg-jessa-lim@salina.dev', 'Jessa Mae Lim', 'member'),
    ('20202020-2020-20e4-2020-202020202020'::uuid, 'cit-u-ssg-kyle-fernandez@salina.dev', 'Kyle Fernandez', 'member'),
    ('20202020-2020-20e5-2020-202020202020'::uuid, 'cit-u-ssg-rhea-castillo@salina.dev', 'Rhea Castillo', 'member'),
    ('20202020-2020-20e6-2020-202020202020'::uuid, 'cit-u-ssg-ivan-dacera@salina.dev', 'Ivan Dacera', 'member'),
    ('20202020-2020-20e7-2020-202020202020'::uuid, 'cit-u-ssg-sofia-alcoran@salina.dev', 'Sofia Alcoran', 'member'),
    ('20202020-2020-20e8-2020-202020202020'::uuid, 'cit-u-ssg-trisha-gomez@salina.dev', 'Trisha Gomez', 'member'),
    ('20202020-2020-20e9-2020-202020202020'::uuid, 'cit-u-ssg-alvin-navarro@salina.dev', 'Alvin Navarro', 'member'),
    ('20202020-2020-20ea-2020-202020202020'::uuid, 'cit-u-ssg-mae-dizon@salina.dev', 'Mae Dizon', 'member'),
    ('20202020-2020-20eb-2020-202020202020'::uuid, 'cit-u-ssg-nico-villanueva@salina.dev', 'Nico Villanueva', 'member'),
    ('20202020-2020-20ec-2020-202020202020'::uuid, 'cit-u-ssg-angel-reyes@salina.dev', 'Angel Reyes', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
select
  user_id,
  user_id,
  email,
  'email',
  jsonb_build_object('sub', user_id::text, 'email', email, 'email_verified', true),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
from roster
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

with roster as (
  select *
  from (values
    ('20202020-2020-20e0-2020-202020202020'::uuid, 'cit-u-ssg-admin@salina.dev', 'CIT-U SSG Owner', 'owner'),
    ('20202020-2020-20e1-2020-202020202020'::uuid, 'cit-u-ssg-mia-santos@salina.dev', 'Mia Santos', 'officer'),
    ('20202020-2020-20e2-2020-202020202020'::uuid, 'cit-u-ssg-paolo-mercado@salina.dev', 'Paolo Mercado', 'officer'),
    ('20202020-2020-20e3-2020-202020202020'::uuid, 'cit-u-ssg-jessa-lim@salina.dev', 'Jessa Mae Lim', 'member'),
    ('20202020-2020-20e4-2020-202020202020'::uuid, 'cit-u-ssg-kyle-fernandez@salina.dev', 'Kyle Fernandez', 'member'),
    ('20202020-2020-20e5-2020-202020202020'::uuid, 'cit-u-ssg-rhea-castillo@salina.dev', 'Rhea Castillo', 'member'),
    ('20202020-2020-20e6-2020-202020202020'::uuid, 'cit-u-ssg-ivan-dacera@salina.dev', 'Ivan Dacera', 'member'),
    ('20202020-2020-20e7-2020-202020202020'::uuid, 'cit-u-ssg-sofia-alcoran@salina.dev', 'Sofia Alcoran', 'member'),
    ('20202020-2020-20e8-2020-202020202020'::uuid, 'cit-u-ssg-trisha-gomez@salina.dev', 'Trisha Gomez', 'member'),
    ('20202020-2020-20e9-2020-202020202020'::uuid, 'cit-u-ssg-alvin-navarro@salina.dev', 'Alvin Navarro', 'member'),
    ('20202020-2020-20ea-2020-202020202020'::uuid, 'cit-u-ssg-mae-dizon@salina.dev', 'Mae Dizon', 'member'),
    ('20202020-2020-20eb-2020-202020202020'::uuid, 'cit-u-ssg-nico-villanueva@salina.dev', 'Nico Villanueva', 'member'),
    ('20202020-2020-20ec-2020-202020202020'::uuid, 'cit-u-ssg-angel-reyes@salina.dev', 'Angel Reyes', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into public.organization_memberships (id, tenant_id, user_id, role)
select
  user_id,
  '20202020-2020-2020-2020-202020202020',
  user_id,
  role
from roster
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- Tokyo Jujutsu roster
with roster as (
  select *
  from (values
    ('21212121-2121-21e0-2121-212121212121'::uuid, 'tokyo-jujutsu-admin@salina.dev', 'Tokyo Jujutsu Owner', 'owner'),
    ('21212121-2121-21e1-2121-212121212121'::uuid, 'tokyo-jujutsu-utahime@salina.dev', 'Utahime Iori', 'officer'),
    ('21212121-2121-21e2-2121-212121212121'::uuid, 'tokyo-jujutsu-shoko@salina.dev', 'Shoko Ieiri', 'officer'),
    ('21212121-2121-21e3-2121-212121212121'::uuid, 'tokyo-jujutsu-yuta@salina.dev', 'Yuta Okkotsu', 'member'),
    ('21212121-2121-21e4-2121-212121212121'::uuid, 'tokyo-jujutsu-maki@salina.dev', 'Maki Zenin', 'member'),
    ('21212121-2121-21e5-2121-212121212121'::uuid, 'tokyo-jujutsu-panda@salina.dev', 'Panda', 'member'),
    ('21212121-2121-21e6-2121-212121212121'::uuid, 'tokyo-jujutsu-inumaki@salina.dev', 'Toge Inumaki', 'member'),
    ('21212121-2121-21e7-2121-212121212121'::uuid, 'tokyo-jujutsu-hakari@salina.dev', 'Kinji Hakari', 'member'),
    ('21212121-2121-21e8-2121-212121212121'::uuid, 'tokyo-jujutsu-kirara@salina.dev', 'Kirara Hoshi', 'member'),
    ('21212121-2121-21e9-2121-212121212121'::uuid, 'tokyo-jujutsu-ino@salina.dev', 'Takuma Ino', 'member'),
    ('21212121-2121-21ea-2121-212121212121'::uuid, 'tokyo-jujutsu-nanami@salina.dev', 'Kento Nanami', 'member'),
    ('21212121-2121-21eb-2121-212121212121'::uuid, 'tokyo-jujutsu-todo@salina.dev', 'Aoi Todo', 'member'),
    ('21212121-2121-21ec-2121-212121212121'::uuid, 'tokyo-jujutsu-kusakabe@salina.dev', 'Atsuya Kusakabe', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
select
  user_id,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object('tenant_id', '21212121-2121-2121-2121-212121212121'),
  jsonb_build_object('display_name', display_name, 'tenant_slug', 'tokyo-jujutsu'),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
from roster
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

with roster as (
  select *
  from (values
    ('21212121-2121-21e0-2121-212121212121'::uuid, 'tokyo-jujutsu-admin@salina.dev', 'Tokyo Jujutsu Owner', 'owner'),
    ('21212121-2121-21e1-2121-212121212121'::uuid, 'tokyo-jujutsu-utahime@salina.dev', 'Utahime Iori', 'officer'),
    ('21212121-2121-21e2-2121-212121212121'::uuid, 'tokyo-jujutsu-shoko@salina.dev', 'Shoko Ieiri', 'officer'),
    ('21212121-2121-21e3-2121-212121212121'::uuid, 'tokyo-jujutsu-yuta@salina.dev', 'Yuta Okkotsu', 'member'),
    ('21212121-2121-21e4-2121-212121212121'::uuid, 'tokyo-jujutsu-maki@salina.dev', 'Maki Zenin', 'member'),
    ('21212121-2121-21e5-2121-212121212121'::uuid, 'tokyo-jujutsu-panda@salina.dev', 'Panda', 'member'),
    ('21212121-2121-21e6-2121-212121212121'::uuid, 'tokyo-jujutsu-inumaki@salina.dev', 'Toge Inumaki', 'member'),
    ('21212121-2121-21e7-2121-212121212121'::uuid, 'tokyo-jujutsu-hakari@salina.dev', 'Kinji Hakari', 'member'),
    ('21212121-2121-21e8-2121-212121212121'::uuid, 'tokyo-jujutsu-kirara@salina.dev', 'Kirara Hoshi', 'member'),
    ('21212121-2121-21e9-2121-212121212121'::uuid, 'tokyo-jujutsu-ino@salina.dev', 'Takuma Ino', 'member'),
    ('21212121-2121-21ea-2121-212121212121'::uuid, 'tokyo-jujutsu-nanami@salina.dev', 'Kento Nanami', 'member'),
    ('21212121-2121-21eb-2121-212121212121'::uuid, 'tokyo-jujutsu-todo@salina.dev', 'Aoi Todo', 'member'),
    ('21212121-2121-21ec-2121-212121212121'::uuid, 'tokyo-jujutsu-kusakabe@salina.dev', 'Atsuya Kusakabe', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
select
  user_id,
  user_id,
  email,
  'email',
  jsonb_build_object('sub', user_id::text, 'email', email, 'email_verified', true),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
from roster
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

with roster as (
  select *
  from (values
    ('21212121-2121-21e0-2121-212121212121'::uuid, 'tokyo-jujutsu-admin@salina.dev', 'Tokyo Jujutsu Owner', 'owner'),
    ('21212121-2121-21e1-2121-212121212121'::uuid, 'tokyo-jujutsu-utahime@salina.dev', 'Utahime Iori', 'officer'),
    ('21212121-2121-21e2-2121-212121212121'::uuid, 'tokyo-jujutsu-shoko@salina.dev', 'Shoko Ieiri', 'officer'),
    ('21212121-2121-21e3-2121-212121212121'::uuid, 'tokyo-jujutsu-yuta@salina.dev', 'Yuta Okkotsu', 'member'),
    ('21212121-2121-21e4-2121-212121212121'::uuid, 'tokyo-jujutsu-maki@salina.dev', 'Maki Zenin', 'member'),
    ('21212121-2121-21e5-2121-212121212121'::uuid, 'tokyo-jujutsu-panda@salina.dev', 'Panda', 'member'),
    ('21212121-2121-21e6-2121-212121212121'::uuid, 'tokyo-jujutsu-inumaki@salina.dev', 'Toge Inumaki', 'member'),
    ('21212121-2121-21e7-2121-212121212121'::uuid, 'tokyo-jujutsu-hakari@salina.dev', 'Kinji Hakari', 'member'),
    ('21212121-2121-21e8-2121-212121212121'::uuid, 'tokyo-jujutsu-kirara@salina.dev', 'Kirara Hoshi', 'member'),
    ('21212121-2121-21e9-2121-212121212121'::uuid, 'tokyo-jujutsu-ino@salina.dev', 'Takuma Ino', 'member'),
    ('21212121-2121-21ea-2121-212121212121'::uuid, 'tokyo-jujutsu-nanami@salina.dev', 'Kento Nanami', 'member'),
    ('21212121-2121-21eb-2121-212121212121'::uuid, 'tokyo-jujutsu-todo@salina.dev', 'Aoi Todo', 'member'),
    ('21212121-2121-21ec-2121-212121212121'::uuid, 'tokyo-jujutsu-kusakabe@salina.dev', 'Atsuya Kusakabe', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into public.organization_memberships (id, tenant_id, user_id, role)
select
  user_id,
  '21212121-2121-2121-2121-212121212121',
  user_id,
  role
from roster
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- Acme roster
with roster as (
  select *
  from (values
    ('aaaaaaaa-aaaa-20e1-aaaa-aaaaaaaaaaaa'::uuid, 'acme-rachel-mercado@salina.dev', 'Rachel Mercado', 'officer'),
    ('aaaaaaaa-aaaa-20e2-aaaa-aaaaaaaaaaaa'::uuid, 'acme-daniel-reyes@salina.dev', 'Daniel Reyes', 'officer'),
    ('aaaaaaaa-aaaa-20e3-aaaa-aaaaaaaaaaaa'::uuid, 'acme-janine-lopez@salina.dev', 'Janine Lopez', 'member'),
    ('aaaaaaaa-aaaa-20e4-aaaa-aaaaaaaaaaaa'::uuid, 'acme-cedric-ong@salina.dev', 'Cedric Ong', 'member'),
    ('aaaaaaaa-aaaa-20e5-aaaa-aaaaaaaaaaaa'::uuid, 'acme-paula-santos@salina.dev', 'Paula Santos', 'member'),
    ('aaaaaaaa-aaaa-20e6-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ivan-alfaro@salina.dev', 'Ivan Alfaro', 'member'),
    ('aaaaaaaa-aaaa-20e7-aaaa-aaaaaaaaaaaa'::uuid, 'acme-mara-dela-cruz@salina.dev', 'Mara Dela Cruz', 'member'),
    ('aaaaaaaa-aaaa-20e8-aaaa-aaaaaaaaaaaa'::uuid, 'acme-noel-garcia@salina.dev', 'Noel Garcia', 'member'),
    ('aaaaaaaa-aaaa-20e9-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ella-ramos@salina.dev', 'Ella Ramos', 'member'),
    ('aaaaaaaa-aaaa-20ea-aaaa-aaaaaaaaaaaa'::uuid, 'acme-patrick-navarro@salina.dev', 'Patrick Navarro', 'member'),
    ('aaaaaaaa-aaaa-20eb-aaaa-aaaaaaaaaaaa'::uuid, 'acme-sophia-velasco@salina.dev', 'Sophia Velasco', 'member'),
    ('aaaaaaaa-aaaa-20ec-aaaa-aaaaaaaaaaaa'::uuid, 'acme-kian-dizon@salina.dev', 'Kian Dizon', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
select
  user_id,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object('tenant_id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  jsonb_build_object('display_name', display_name, 'tenant_slug', 'acme'),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
from roster
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

with roster as (
  select *
  from (values
    ('aaaaaaaa-aaaa-20e1-aaaa-aaaaaaaaaaaa'::uuid, 'acme-rachel-mercado@salina.dev', 'Rachel Mercado', 'officer'),
    ('aaaaaaaa-aaaa-20e2-aaaa-aaaaaaaaaaaa'::uuid, 'acme-daniel-reyes@salina.dev', 'Daniel Reyes', 'officer'),
    ('aaaaaaaa-aaaa-20e3-aaaa-aaaaaaaaaaaa'::uuid, 'acme-janine-lopez@salina.dev', 'Janine Lopez', 'member'),
    ('aaaaaaaa-aaaa-20e4-aaaa-aaaaaaaaaaaa'::uuid, 'acme-cedric-ong@salina.dev', 'Cedric Ong', 'member'),
    ('aaaaaaaa-aaaa-20e5-aaaa-aaaaaaaaaaaa'::uuid, 'acme-paula-santos@salina.dev', 'Paula Santos', 'member'),
    ('aaaaaaaa-aaaa-20e6-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ivan-alfaro@salina.dev', 'Ivan Alfaro', 'member'),
    ('aaaaaaaa-aaaa-20e7-aaaa-aaaaaaaaaaaa'::uuid, 'acme-mara-dela-cruz@salina.dev', 'Mara Dela Cruz', 'member'),
    ('aaaaaaaa-aaaa-20e8-aaaa-aaaaaaaaaaaa'::uuid, 'acme-noel-garcia@salina.dev', 'Noel Garcia', 'member'),
    ('aaaaaaaa-aaaa-20e9-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ella-ramos@salina.dev', 'Ella Ramos', 'member'),
    ('aaaaaaaa-aaaa-20ea-aaaa-aaaaaaaaaaaa'::uuid, 'acme-patrick-navarro@salina.dev', 'Patrick Navarro', 'member'),
    ('aaaaaaaa-aaaa-20eb-aaaa-aaaaaaaaaaaa'::uuid, 'acme-sophia-velasco@salina.dev', 'Sophia Velasco', 'member'),
    ('aaaaaaaa-aaaa-20ec-aaaa-aaaaaaaaaaaa'::uuid, 'acme-kian-dizon@salina.dev', 'Kian Dizon', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
select
  user_id,
  user_id,
  email,
  'email',
  jsonb_build_object('sub', user_id::text, 'email', email, 'email_verified', true),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
from roster
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

with roster as (
  select *
  from (values
    ('aaaaaaaa-aaaa-20e1-aaaa-aaaaaaaaaaaa'::uuid, 'acme-rachel-mercado@salina.dev', 'Rachel Mercado', 'officer'),
    ('aaaaaaaa-aaaa-20e2-aaaa-aaaaaaaaaaaa'::uuid, 'acme-daniel-reyes@salina.dev', 'Daniel Reyes', 'officer'),
    ('aaaaaaaa-aaaa-20e3-aaaa-aaaaaaaaaaaa'::uuid, 'acme-janine-lopez@salina.dev', 'Janine Lopez', 'member'),
    ('aaaaaaaa-aaaa-20e4-aaaa-aaaaaaaaaaaa'::uuid, 'acme-cedric-ong@salina.dev', 'Cedric Ong', 'member'),
    ('aaaaaaaa-aaaa-20e5-aaaa-aaaaaaaaaaaa'::uuid, 'acme-paula-santos@salina.dev', 'Paula Santos', 'member'),
    ('aaaaaaaa-aaaa-20e6-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ivan-alfaro@salina.dev', 'Ivan Alfaro', 'member'),
    ('aaaaaaaa-aaaa-20e7-aaaa-aaaaaaaaaaaa'::uuid, 'acme-mara-dela-cruz@salina.dev', 'Mara Dela Cruz', 'member'),
    ('aaaaaaaa-aaaa-20e8-aaaa-aaaaaaaaaaaa'::uuid, 'acme-noel-garcia@salina.dev', 'Noel Garcia', 'member'),
    ('aaaaaaaa-aaaa-20e9-aaaa-aaaaaaaaaaaa'::uuid, 'acme-ella-ramos@salina.dev', 'Ella Ramos', 'member'),
    ('aaaaaaaa-aaaa-20ea-aaaa-aaaaaaaaaaaa'::uuid, 'acme-patrick-navarro@salina.dev', 'Patrick Navarro', 'member'),
    ('aaaaaaaa-aaaa-20eb-aaaa-aaaaaaaaaaaa'::uuid, 'acme-sophia-velasco@salina.dev', 'Sophia Velasco', 'member'),
    ('aaaaaaaa-aaaa-20ec-aaaa-aaaaaaaaaaaa'::uuid, 'acme-kian-dizon@salina.dev', 'Kian Dizon', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into public.organization_memberships (id, tenant_id, user_id, role)
select
  user_id,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  user_id,
  role
from roster
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());

-- ICPEP.SE roster
with roster as (
  select *
  from (values
    ('13131313-1313-31e1-1313-131313131313'::uuid, 'icpep-se-anna-cruz@salina.dev', 'Anna Cruz', 'officer'),
    ('13131313-1313-31e2-1313-131313131313'::uuid, 'icpep-se-mark-velasco@salina.dev', 'Mark Velasco', 'officer'),
    ('13131313-1313-31e3-1313-131313131313'::uuid, 'icpep-se-julia-garcia@salina.dev', 'Julia Garcia', 'member'),
    ('13131313-1313-31e4-1313-131313131313'::uuid, 'icpep-se-ethan-lopez@salina.dev', 'Ethan Lopez', 'member'),
    ('13131313-1313-31e5-1313-131313131313'::uuid, 'icpep-se-princess-santos@salina.dev', 'Princess Santos', 'member'),
    ('13131313-1313-31e6-1313-131313131313'::uuid, 'icpep-se-ronald-mendoza@salina.dev', 'Ronald Mendoza', 'member'),
    ('13131313-1313-31e7-1313-131313131313'::uuid, 'icpep-se-lia-ramos@salina.dev', 'Lia Ramos', 'member'),
    ('13131313-1313-31e8-1313-131313131313'::uuid, 'icpep-se-joseph-lim@salina.dev', 'Joseph Lim', 'member'),
    ('13131313-1313-31e9-1313-131313131313'::uuid, 'icpep-se-karen-velasco@salina.dev', 'Karen Velasco', 'member'),
    ('13131313-1313-31ea-1313-131313131313'::uuid, 'icpep-se-miguel-dizon@salina.dev', 'Miguel Dizon', 'member'),
    ('13131313-1313-31eb-1313-131313131313'::uuid, 'icpep-se-bea-navarro@salina.dev', 'Bea Navarro', 'member'),
    ('13131313-1313-31ec-1313-131313131313'::uuid, 'icpep-se-ivan-soriano@salina.dev', 'Ivan Soriano', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  instance_id, confirmation_token, recovery_token, email_change_token_new,
  email_change, phone_change, phone_change_token, email_change_token_current,
  reauthentication_token
)
select
  user_id,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('SalinaPreview123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object('tenant_id', '13131313-1313-1313-1313-131313131313'),
  jsonb_build_object('display_name', display_name, 'tenant_slug', 'icpep-se'),
  timezone('utc', now()),
  timezone('utc', now()),
  '00000000-0000-0000-0000-000000000000',
  '', '', '', '', '', '', '', ''
from roster
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

with roster as (
  select *
  from (values
    ('13131313-1313-31e1-1313-131313131313'::uuid, 'icpep-se-anna-cruz@salina.dev', 'Anna Cruz', 'officer'),
    ('13131313-1313-31e2-1313-131313131313'::uuid, 'icpep-se-mark-velasco@salina.dev', 'Mark Velasco', 'officer'),
    ('13131313-1313-31e3-1313-131313131313'::uuid, 'icpep-se-julia-garcia@salina.dev', 'Julia Garcia', 'member'),
    ('13131313-1313-31e4-1313-131313131313'::uuid, 'icpep-se-ethan-lopez@salina.dev', 'Ethan Lopez', 'member'),
    ('13131313-1313-31e5-1313-131313131313'::uuid, 'icpep-se-princess-santos@salina.dev', 'Princess Santos', 'member'),
    ('13131313-1313-31e6-1313-131313131313'::uuid, 'icpep-se-ronald-mendoza@salina.dev', 'Ronald Mendoza', 'member'),
    ('13131313-1313-31e7-1313-131313131313'::uuid, 'icpep-se-lia-ramos@salina.dev', 'Lia Ramos', 'member'),
    ('13131313-1313-31e8-1313-131313131313'::uuid, 'icpep-se-joseph-lim@salina.dev', 'Joseph Lim', 'member'),
    ('13131313-1313-31e9-1313-131313131313'::uuid, 'icpep-se-karen-velasco@salina.dev', 'Karen Velasco', 'member'),
    ('13131313-1313-31ea-1313-131313131313'::uuid, 'icpep-se-miguel-dizon@salina.dev', 'Miguel Dizon', 'member'),
    ('13131313-1313-31eb-1313-131313131313'::uuid, 'icpep-se-bea-navarro@salina.dev', 'Bea Navarro', 'member'),
    ('13131313-1313-31ec-1313-131313131313'::uuid, 'icpep-se-ivan-soriano@salina.dev', 'Ivan Soriano', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into auth.identities (
  id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
)
select
  user_id,
  user_id,
  email,
  'email',
  jsonb_build_object('sub', user_id::text, 'email', email, 'email_verified', true),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
from roster
on conflict (provider_id, provider) do update
set
  user_id = excluded.user_id,
  identity_data = excluded.identity_data,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = timezone('utc', now());

with roster as (
  select *
  from (values
    ('13131313-1313-31e1-1313-131313131313'::uuid, 'icpep-se-anna-cruz@salina.dev', 'Anna Cruz', 'officer'),
    ('13131313-1313-31e2-1313-131313131313'::uuid, 'icpep-se-mark-velasco@salina.dev', 'Mark Velasco', 'officer'),
    ('13131313-1313-31e3-1313-131313131313'::uuid, 'icpep-se-julia-garcia@salina.dev', 'Julia Garcia', 'member'),
    ('13131313-1313-31e4-1313-131313131313'::uuid, 'icpep-se-ethan-lopez@salina.dev', 'Ethan Lopez', 'member'),
    ('13131313-1313-31e5-1313-131313131313'::uuid, 'icpep-se-princess-santos@salina.dev', 'Princess Santos', 'member'),
    ('13131313-1313-31e6-1313-131313131313'::uuid, 'icpep-se-ronald-mendoza@salina.dev', 'Ronald Mendoza', 'member'),
    ('13131313-1313-31e7-1313-131313131313'::uuid, 'icpep-se-lia-ramos@salina.dev', 'Lia Ramos', 'member'),
    ('13131313-1313-31e8-1313-131313131313'::uuid, 'icpep-se-joseph-lim@salina.dev', 'Joseph Lim', 'member'),
    ('13131313-1313-31e9-1313-131313131313'::uuid, 'icpep-se-karen-velasco@salina.dev', 'Karen Velasco', 'member'),
    ('13131313-1313-31ea-1313-131313131313'::uuid, 'icpep-se-miguel-dizon@salina.dev', 'Miguel Dizon', 'member'),
    ('13131313-1313-31eb-1313-131313131313'::uuid, 'icpep-se-bea-navarro@salina.dev', 'Bea Navarro', 'member'),
    ('13131313-1313-31ec-1313-131313131313'::uuid, 'icpep-se-ivan-soriano@salina.dev', 'Ivan Soriano', 'member')
  ) as roster(user_id, email, display_name, role)
)
insert into public.organization_memberships (id, tenant_id, user_id, role)
select
  user_id,
  '13131313-1313-1313-1313-131313131313',
  user_id,
  role
from roster
on conflict (tenant_id, user_id) do update
set
  role = excluded.role,
  updated_at = timezone('utc', now());
