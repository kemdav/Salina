create or replace function public.organizations_theme_config_is_valid(theme_config jsonb)
returns boolean
language sql
immutable
as $$
  select case
    when theme_config is null then false
    when jsonb_typeof(theme_config) <> 'object' then false
    else not exists (
      select 1
      from jsonb_object_keys(theme_config) as theme_config_key(key)
      where theme_config_key.key not in ('primaryColor', 'logoUrl', 'fontFamily')
    )
  end;
$$;

alter table public.organizations
  add column if not exists theme_config jsonb not null default '{}'::jsonb;

alter table public.organizations
  drop constraint if exists organizations_theme_config_allowed_keys_check;

alter table public.organizations
  add constraint organizations_theme_config_allowed_keys_check
  check (public.organizations_theme_config_is_valid(theme_config));
