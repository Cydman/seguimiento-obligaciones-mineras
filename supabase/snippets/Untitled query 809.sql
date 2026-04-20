alter table public.mining_titles
add column if not exists holder_name text,
add column if not exists holder_identification text,
add column if not exists holder_address text,
add column if not exists holder_phone text,
add column if not exists holder_email text,

add column if not exists subcontractor_name text,
add column if not exists subcontractor_identification text,
add column if not exists subcontractor_address text,
add column if not exists subcontractor_phone text,
add column if not exists subcontractor_email text,

add column if not exists mine_name text,
add column if not exists village text,
add column if not exists title_modality text,
add column if not exists granted_area text,
add column if not exists rmn_registration_date date,
add column if not exists contract_stage text,
add column if not exists subcontract_rmn_registration_date date,
add column if not exists annuality text,
add column if not exists is_active boolean not null default true;

create index if not exists idx_mining_titles_is_active
on public.mining_titles(is_active);