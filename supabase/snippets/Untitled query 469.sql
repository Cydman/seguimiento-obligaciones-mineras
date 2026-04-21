create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id
  from public.profiles
  where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.mining_titles enable row level security;
alter table public.obligations enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "organizations_select_admin_or_own" on public.organizations;
drop policy if exists "organizations_admin_manage" on public.organizations;
drop policy if exists "mining_titles_select_admin_or_own_org" on public.mining_titles;
drop policy if exists "mining_titles_admin_manage" on public.mining_titles;
drop policy if exists "obligations_select_admin_or_own_org" on public.obligations;
drop policy if exists "obligations_admin_insert" on public.obligations;
drop policy if exists "obligations_admin_update" on public.obligations;
drop policy if exists "obligations_admin_delete" on public.obligations;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (
  id = auth.uid() or public.is_admin()
);

create policy "organizations_select_admin_or_own"
on public.organizations
for select
using (
  public.is_admin() or id = public.current_organization_id()
);

create policy "organizations_admin_manage"
on public.organizations
for all
using (public.is_admin())
with check (public.is_admin());

create policy "mining_titles_select_admin_or_own_org"
on public.mining_titles
for select
using (
  public.is_admin() or organization_id = public.current_organization_id()
);

create policy "mining_titles_admin_manage"
on public.mining_titles
for all
using (public.is_admin())
with check (public.is_admin());

create policy "obligations_select_admin_or_own_org"
on public.obligations
for select
using (
  public.is_admin() or organization_id = public.current_organization_id()
);

create policy "obligations_admin_insert"
on public.obligations
for insert
with check (public.is_admin());

create policy "obligations_admin_update"
on public.obligations
for update
using (public.is_admin())
with check (public.is_admin());

create policy "obligations_admin_delete"
on public.obligations
for delete
using (public.is_admin());