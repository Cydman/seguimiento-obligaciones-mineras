create extension if not exists pgcrypto;

create type subscription_plan as enum ('basico', 'profesional', 'empresarial');
create type authority_code as enum ('ANM', 'ANLA', 'CAR', 'MUNICIPIO', 'OTRA');
create type obligation_status as enum ('pendiente', 'en_proceso', 'cumplida', 'vencida');
create type obligation_priority as enum ('alta', 'media', 'baja');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  document_number text not null unique,
  subscription_plan subscription_plan not null default 'basico',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mining_titles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  mineral text not null,
  municipality text not null,
  department text not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.obligations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title_id uuid not null references public.mining_titles(id) on delete cascade,
  code text not null unique,
  name text not null,
  authority authority_code not null,
  status obligation_status not null default 'pendiente',
  priority obligation_priority not null default 'media',
  due_date date not null,
  description text not null,
  legal_basis text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_mining_titles_organization_id
  on public.mining_titles(organization_id);

create index idx_obligations_organization_id
  on public.obligations(organization_id);

create index idx_obligations_title_id
  on public.obligations(title_id);

create index idx_obligations_status
  on public.obligations(status);

create index idx_obligations_due_date
  on public.obligations(due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_organizations_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

create trigger trg_mining_titles_updated_at
before update on public.mining_titles
for each row
execute function public.set_updated_at();

create trigger trg_obligations_updated_at
before update on public.obligations
for each row
execute function public.set_updated_at();