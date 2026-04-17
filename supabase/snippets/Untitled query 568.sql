update public.organizations
set theme_config = '{"primaryColor":"#0f766e","logoUrl":"https://example.com/logo.svg","fontFamily":"Inter"}'::jsonb
where slug = 'icpep-se';