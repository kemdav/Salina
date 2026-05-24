alter table public.events add column qr_attendance_enabled boolean not null default false;
alter table public.events add column require_check_out boolean not null default false;
alter table public.event_attendees add column check_out_time timestamptz;
