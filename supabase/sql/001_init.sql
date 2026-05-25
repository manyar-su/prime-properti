-- Prime Property schema bootstrap
create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null check (role in ('admin', 'superadmin')),
  password_hash text not null,
  is_enabled boolean not null default true,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip_address text not null,
  success boolean not null,
  attempted_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  nama_property text not null,
  "group" text,
  lebar numeric(8,2) not null check (lebar > 0),
  panjang numeric(8,2) not null check (panjang > 0),
  hadap text[] not null,
  tipe text not null check (tipe in ('ruko', 'villa')),
  tingkat numeric(4,1) not null check (tingkat >= 1 and tingkat <= 10),
  price bigint not null check (price > 0),
  carport boolean not null,
  status text not null check (status in ('in_stock', 'sold_out')),
  siap text not null check (siap in ('siap_huni', 'siap_kosong', 'siap_huni_renovasi')),
  maps_link text,
  kawasan text[] not null,
  unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid not null references public.admin_profiles(id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id),
  actor_id uuid not null references public.admin_profiles(id),
  actor_email text not null,
  action text not null check (action in ('create', 'update', 'delete')),
  changes jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  email text not null,
  nomor_hp text not null,
  pesan text not null,
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_properties_deleted_at on public.properties(deleted_at);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_tipe on public.properties(tipe);
create index if not exists idx_properties_kawasan on public.properties using gin(kawasan);
create index if not exists idx_properties_hadap on public.properties using gin(hadap);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_admin_profiles_updated_at on public.admin_profiles;
create trigger trg_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.properties enable row level security;
alter table public.audit_logs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.login_attempts enable row level security;

-- default policy: block anon/authenticated direct table access
create policy if not exists "deny_all_admin_profiles" on public.admin_profiles for all using (false);
create policy if not exists "deny_all_properties" on public.properties for all using (false);
create policy if not exists "deny_all_audit_logs" on public.audit_logs for all using (false);
create policy if not exists "deny_all_contact_messages" on public.contact_messages for all using (false);
create policy if not exists "deny_all_login_attempts" on public.login_attempts for all using (false);

