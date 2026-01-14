-- MVP schema for mens-esthe-site (external booking only)
-- Tables: profiles, rooms, therapists, shifts, courses, site_settings
-- RLS: Public SELECT only, Admin write only
-- + GRANTS: schema/table permissions (RLSとは別レイヤー)

begin;

-- Extensions
create extension if not exists pgcrypto;

-- =========================
-- 1) profiles (admin flag)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Admin check function
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

-- =========================
-- 2) rooms
-- =========================
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  access_note text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_rooms_updated_at on public.rooms;
create trigger trg_rooms_updated_at
before update on public.rooms
for each row execute function public.set_updated_at();

-- =========================
-- 3) therapists
-- =========================
create table if not exists public.therapists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  profile_text text,
  main_image_url text,

  age int,
  height int,
  bust int,
  waist int,
  hip int,
  cup text,

  tags text[] not null default '{}',
  sns_urls jsonb not null default '{}'::jsonb,

  booking_url text, -- optional: per-therapist external booking link

  is_newface boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_therapists_updated_at on public.therapists;
create trigger trg_therapists_updated_at
before update on public.therapists
for each row execute function public.set_updated_at();

-- =========================
-- 4) shifts
-- =========================
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete restrict,
  start_at timestamptz not null,
  end_at timestamptz not null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shifts_time_valid check (end_at > start_at)
);

create index if not exists idx_shifts_start_at on public.shifts(start_at);
create index if not exists idx_shifts_room_id on public.shifts(room_id);
create index if not exists idx_shifts_therapist_id on public.shifts(therapist_id);

drop trigger if exists trg_shifts_updated_at on public.shifts;
create trigger trg_shifts_updated_at
before update on public.shifts
for each row execute function public.set_updated_at();

-- =========================
-- 5) courses
-- =========================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_min int not null,
  price int not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_duration_valid check (duration_min > 0),
  constraint courses_price_valid check (price >= 0)
);

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

-- =========================
-- 6) site_settings (single row)
-- =========================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  global_booking_url text,
  line_url text,
  x_url text,
  instagram_url text,
  notice_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- Ensure at least one row exists (safe upsert style)
insert into public.site_settings (id, global_booking_url)
select gen_random_uuid(), null
where not exists (select 1 from public.site_settings);

-- =========================
-- RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.therapists enable row level security;
alter table public.shifts enable row level security;
alter table public.courses enable row level security;
alter table public.site_settings enable row level security;

-- ---------- profiles policies ----------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- ---------- Public read-only policies ----------
-- rooms
drop policy if exists "rooms_public_select" on public.rooms;
create policy "rooms_public_select"
on public.rooms
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "rooms_admin_write" on public.rooms;
create policy "rooms_admin_write"
on public.rooms
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- therapists
drop policy if exists "therapists_public_select" on public.therapists;
create policy "therapists_public_select"
on public.therapists
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "therapists_admin_write" on public.therapists;
create policy "therapists_admin_write"
on public.therapists
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- shifts
drop policy if exists "shifts_public_select" on public.shifts;
create policy "shifts_public_select"
on public.shifts
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "shifts_admin_write" on public.shifts;
create policy "shifts_admin_write"
on public.shifts
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- courses
drop policy if exists "courses_public_select" on public.courses;
create policy "courses_public_select"
on public.courses
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write"
on public.courses
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- site_settings (public read)
-- NOTE: using(true) は「公開してよい情報だけ入れる」前提。
-- 将来、機密設定を追加するなら公開用テーブル/ビューに分離すること。
drop policy if exists "site_settings_public_select" on public.site_settings;
create policy "site_settings_public_select"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
on public.site_settings
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- =========================
-- GRANTS (RLSとは別レイヤー)
-- =========================
grant usage on schema public to anon, authenticated;

grant select on table public.rooms to anon, authenticated;
grant select on table public.therapists to anon, authenticated;
grant select on table public.shifts to anon, authenticated;
grant select on table public.courses to anon, authenticated;
grant select on table public.site_settings to anon, authenticated;

-- Admin write: authenticatedに書き込み権限（RLSでadminのみ許可）
grant insert, update, delete on table public.rooms to authenticated;
grant insert, update, delete on table public.therapists to authenticated;
grant insert, update, delete on table public.shifts to authenticated;
grant insert, update, delete on table public.courses to authenticated;
grant insert, update, delete on table public.site_settings to authenticated;

grant select, insert, update on table public.profiles to authenticated;

-- Functions used by RLS/policies
grant execute on function public.is_admin(uuid) to authenticated;

commit;
