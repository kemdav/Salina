alter table public.temporary_applicants enable row level security;

create trigger enforce_temporary_applicants_tenant_scope
before insert or update on public.temporary_applicants
for each row
execute function public.enforce_tenant_scope();

create policy temporary_applicants_tenant_isolation
  on public.temporary_applicants
  for all
  to authenticated
  using (public.has_tenant_access(tenant_id))
  with check (public.has_tenant_access(tenant_id));

grant select, insert, update, delete on public.temporary_applicants to authenticated, service_role;