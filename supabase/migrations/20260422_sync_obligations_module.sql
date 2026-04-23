-- 1) obligations: columnas que ya usa el código local funcional
alter table public.obligations
  add column if not exists category text,
  add column if not exists assigned_profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists created_by uuid,
  add column if not exists updated_by uuid,
  add column if not exists is_active boolean not null default true,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by uuid,
  add column if not exists delete_reason text;

update public.obligations
set
  category = coalesce(category, 'juridica'),
  is_active = coalesce(is_active, true)
where category is null
   or is_active is null;

create index if not exists idx_obligations_assigned_profile_id
  on public.obligations(assigned_profile_id);

create index if not exists idx_obligations_is_active
  on public.obligations(is_active);

create index if not exists idx_obligations_category
  on public.obligations(category);

-- 2) función para generar código automático por categoría
create or replace function public.generate_obligation_code(cat text)
returns text
language plpgsql
as $$
declare
  prefix text;
  next_num integer;
begin
  prefix := case lower(trim(cat))
    when 'tecnica' then 'TEC'
    when 'juridica' then 'JUR'
    when 'economica' then 'ECO'
    when 'social' then 'SOC'
    when 'ambiental' then 'AMB'
    else 'GEN'
  end;

  select coalesce(
    max(substring(code from '([0-9]+)$')::integer),
    0
  ) + 1
  into next_num
  from public.obligations
  where code like ('OBL-' || prefix || '-%');

  return 'OBL-' || prefix || '-' || lpad(next_num::text, 4, '0');
end;
$$;

-- 3) tabla de actuaciones
create table if not exists public.obligation_activity_logs (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  note text,
  payload jsonb,
  attachment_path text,
  attachment_name text,
  attachment_mime text,
  attachment_size bigint,
  is_system boolean not null default false,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_obligation_activity_logs_obligation_id
  on public.obligation_activity_logs(obligation_id);

create index if not exists idx_obligation_activity_logs_is_system
  on public.obligation_activity_logs(is_system);

create index if not exists idx_obligation_activity_logs_created_at
  on public.obligation_activity_logs(created_at desc);

-- 4) tabla de documentos generales por obligación
create table if not exists public.obligation_documents (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_obligation_documents_obligation_id
  on public.obligation_documents(obligation_id);

create index if not exists idx_obligation_documents_organization_id
  on public.obligation_documents(organization_id);

-- 5) bucket privado para PDFs por actuación
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'obligation-activity-files',
  'obligation-activity-files',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do nothing;

-- 6) bucket privado para documentos generales por obligación
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'obligation-documents',
  'obligation-documents',
  false,
  10485760,
  array['application/pdf']
)
on conflict (id) do nothing;

-- 7) trigger updated_at para actuaciones
drop trigger if exists trg_obligation_activity_logs_updated_at on public.obligation_activity_logs;

create trigger trg_obligation_activity_logs_updated_at
before update on public.obligation_activity_logs
for each row
execute function public.set_updated_at();