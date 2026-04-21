alter table public.obligation_activity_logs
add column if not exists is_system boolean not null default false,
add column if not exists attachment_path text,
add column if not exists attachment_name text,
add column if not exists attachment_mime text,
add column if not exists attachment_size bigint,
add column if not exists updated_at timestamptz not null default now,
add column if not exists updated_by uuid references public.profiles(id) on delete set null;

insert into storage.buckets (id, name, public)
values ('obligation-activity-files', 'obligation-activity-files', false)
on conflict (id) do nothing;

update public.obligation_activity_logs
set is_system = true
where action in ('created', 'updated', 'deactivated', 'document_uploaded');