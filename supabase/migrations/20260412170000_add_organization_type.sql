alter table public.organizations
add column if not exists organization_type text;

update public.organizations
set organization_type = case slug
  when 'acme' then 'Business / Corporation'
  when 'icpep-se' then 'Academic Institution'
  else organization_type
end
where organization_type is null;