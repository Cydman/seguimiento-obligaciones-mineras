create table if not exists public.obligation_documents (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  file_size bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_obligation_documents_obligation_id
on public.obligation_documents(obligation_id);

create index if not exists idx_obligation_documents_organization_id
on public.obligation_documents(organization_id);

create or replace function public.can_access_obligation(target_obligation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.obligations o
    join public.profiles p on p.id = auth.uid()
    where o.id = target_obligation_id
      and (
        p.role = 'admin'
        or o.organization_id = p.organization_id
      )
  );
$$;

alter table public.obligation_documents enable row level security;

drop policy if exists "obligation_documents_select" on public.obligation_documents;
drop policy if exists "obligation_documents_insert_admin" on public.obligation_documents;
drop policy if exists "obligation_documents_delete_admin" on public.obligation_documents;

create policy "obligation_documents_select"
on public.obligation_documents
for select
using (
  public.is_admin() or organization_id = public.current_organization_id()
);

create policy "obligation_documents_insert_admin"
on public.obligation_documents
for insert
with check (public.is_admin());

create policy "obligation_documents_delete_admin"
on public.obligation_documents
for delete
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('obligation-documents', 'obligation-documents', false)
on conflict (id) do nothing;

drop policy if exists "storage_obligation_documents_select" on storage.objects;
drop policy if exists "storage_obligation_documents_insert_admin" on storage.objects;
drop policy if exists "storage_obligation_documents_delete_admin" on storage.objects;

create policy "storage_obligation_documents_select"
on storage.objects
for select
using (
  bucket_id = 'obligation-documents'
  and public.can_access_obligation(((storage.foldername(name))[1])::uuid)
);

create policy "storage_obligation_documents_insert_admin"
on storage.objects
for insert
with check (
  bucket_id = 'obligation-documents'
  and public.is_admin()
);

create policy "storage_obligation_documents_delete_admin"
on storage.objects
for delete
using (
  bucket_id = 'obligation-documents'
  and public.is_admin()
);