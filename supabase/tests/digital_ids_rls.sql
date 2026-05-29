begin;
create extension if not exists pgtap with schema extensions;

select plan(3);

select has_table('public', 'digital_ids', 'digital_ids table exists');

select policies_are(
  'public',
  'digital_ids',
  array['digital_ids_tenant_isolation_select', 'digital_ids_tenant_isolation_insert', 'digital_ids_tenant_isolation_update', 'digital_ids_tenant_isolation_delete']
);

select col_is_unique('public', 'digital_ids', 'id_number', 'id_number column should be unique');

select * from finish();
rollback;
