create sequence if not exists public.digital_id_seq;

create table public.digital_ids (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.organizations(id) on delete cascade,
  membership_id uuid not null references public.organization_memberships(id) on delete cascade,
  id_number text not null unique,
  qr_code_url text,
  is_active boolean not null default true,
  issued_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null default (timezone('utc', now()) + interval '1 year'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, membership_id)
);

create index digital_ids_tenant_id_idx on public.digital_ids (tenant_id);
create index digital_ids_id_number_idx on public.digital_ids (id_number);

create trigger set_digital_ids_updated_at
before update on public.digital_ids
for each row
execute function public.set_current_timestamp();

create trigger enforce_digital_ids_tenant_scope
before insert or update on public.digital_ids
for each row
execute function public.enforce_tenant_scope();

alter table public.digital_ids enable row level security;

create policy digital_ids_tenant_isolation_select
  on public.digital_ids
  for select
  to authenticated
  using (
    public.has_tenant_access(tenant_id)
  );

create policy digital_ids_tenant_isolation_insert
  on public.digital_ids
  for insert
  to authenticated
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

create policy digital_ids_tenant_isolation_update
  on public.digital_ids
  for update
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  )
  with check (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

create policy digital_ids_tenant_isolation_delete
  on public.digital_ids
  for delete
  to authenticated
  using (
    public.has_tenant_access(tenant_id) and
    public.is_tenant_admin(tenant_id)
  );

create or replace function public.generate_member_id_number(p_tenant_slug text, p_seq bigint)
returns text
language plpgsql
as $$
begin
  return p_tenant_slug || '-' || to_char(now(), 'YYYY') || '-' || lpad(p_seq::text, 4, '0');
end;
$$;

create or replace function public.set_digital_id_number()
returns trigger
language plpgsql
as $$
declare
  v_slug text;
  v_seq bigint;
begin
  if new.id_number is null then
    select slug into v_slug from public.organizations where id = new.tenant_id;
    select nextval('public.digital_id_seq') into v_seq;
    new.id_number := public.generate_member_id_number(v_slug, v_seq);
  end if;
  return new;
end;
$$;

create trigger auto_generate_id_number
before insert on public.digital_ids
for each row
execute function public.set_digital_id_number();

grant select, insert, update, delete on public.digital_ids to authenticated, service_role;
grant usage, select on sequence public.digital_id_seq to authenticated, service_role;
