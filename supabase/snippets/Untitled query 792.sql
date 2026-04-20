alter table public.obligations
add column if not exists is_active boolean not null default true,
add column if not exists deleted_at timestamptz,
add column if not exists deleted_by uuid references auth.users(id) on delete set null,
add column if not exists delete_reason text;

create index if not exists idx_obligations_is_active
on public.obligations(is_active);