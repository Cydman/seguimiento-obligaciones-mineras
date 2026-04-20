alter type public.app_role add value if not exists 'specialist';

create type public.obligation_category as enum (
  'tecnica',
  'juridica',
  'economica',
  'social',
  'ambiental'
);

alter table public.profiles
add column if not exists specialty public.obligation_category,
add column if not exists full_name text;

alter table public.obligations
add column if not exists category public.obligation_category not null default 'juridica',
add column if not exists assigned_profile_id uuid references public.profiles(id) on delete set null,
add column if not exists created_by uuid references public.profiles(id) on delete set null,
add column if not exists updated_by uuid references public.profiles(id) on delete set null;

create table if not exists public.obligation_activity_logs (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  note text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_obligation_activity_logs_obligation_id
on public.obligation_activity_logs(obligation_id);

create index if not exists idx_obligation_activity_logs_created_at
on public.obligation_activity_logs(created_at desc);

create sequence if not exists public.obligation_code_seq start 1;

create or replace function public.generate_obligation_code(cat public.obligation_category)
returns text
language plpgsql
as $$
declare
  prefix text;
  seq_number bigint;
begin
  prefix := case cat
    when 'tecnica' then 'TEC'
    when 'juridica' then 'JUR'
    when 'economica' then 'ECO'
    when 'social' then 'SOC'
    when 'ambiental' then 'AMB'
    else 'GEN'
  end;

  seq_number := nextval('public.obligation_code_seq');

  return 'OBL-' || prefix || '-' || lpad(seq_number::text, 6, '0');
end;
$$;