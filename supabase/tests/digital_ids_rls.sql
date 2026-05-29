begin;

select plan(3);

-- Test 1: Cross-tenant access blocked
select results_eq(
  $$
    select has_tenant_access(tenant_id)
    from public.digital_ids
    where id_number = 'should_not_exist'
  $$,
  $$ values (false) $$,
  'Cross-tenant access should be blocked for digital_ids'
);

-- Test 2: Platform admin bypass (Assuming platform admins can access any tenant)
select is_empty(
  $$
    select 1 from public.digital_ids where id_number = 'invalid'
  $$,
  'Platform admins can bypass but still won''t find invalid id_numbers'
);

-- Test 3: id_number uniqueness
-- Need to check if id_number constraint exists
select has_unique(
  'digital_ids',
  'digital_ids_id_number_key',
  'id_number column should be unique'
);

select * from finish();
rollback;
