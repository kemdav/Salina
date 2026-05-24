alter table public.organizations
add column if not exists organization_type text;

update public.organizations
set organization_type = case slug
  when 'acme' then 'Business / Corporation'
  when 'icpep-se' then 'Academic Institution'
  else organization_type
end
where organization_type is null;

-- Backfill theme_config for tenants seeded before the theme_config column existed.
-- The column has a default of '{}'::jsonb from migration 03_theme_config,
-- so tenants created before that migration got an empty config.
update public.organizations
set theme_config = case slug
  when 'system-admin' then jsonb_build_object('primaryColor', '#020817', 'fontFamily', 'var(--font-heading), sans-serif')
  when 'acme' then jsonb_build_object('primaryColor', '#1e40af', 'fontFamily', 'var(--font-heading), sans-serif')
  when 'icpep-se' then jsonb_build_object('primaryColor', '#c6623e', 'fontFamily', 'var(--font-heading), sans-serif')
  else theme_config
end
where theme_config = '{}'::jsonb;