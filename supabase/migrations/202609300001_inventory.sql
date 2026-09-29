create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'pending'
    check (role in ('pending', 'staff', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'pending')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, role)
select id, email, 'pending'
from auth.users
on conflict (id) do nothing;

create or replace function public.is_staff(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user
      and role in ('staff', 'admin')
  );
$$;

revoke all on function public.is_staff(uuid) from public;
grant execute on function public.is_staff(uuid) to authenticated, service_role;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  stock_number text unique,
  make text not null,
  model text not null,
  trim text,
  year integer not null check (year between 1900 and 2100),
  mileage integer not null default 0 check (mileage >= 0),
  price_usd integer not null check (price_usd >= 0),
  monthly_usd integer check (monthly_usd is null or monthly_usd >= 0),
  chassis_number text,
  registration_number text,
  fuel text,
  transmission text,
  drivetrain text,
  body text,
  engine text,
  exterior_color text,
  interior_color text,
  shaken_expiry date,
  location text,
  condition text,
  description text,
  features text[] not null default '{}',
  cover_image_url text,
  status text not null default 'draft'
    check (status in ('draft', 'live', 'reserved', 'sold', 'hidden')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists vehicles_status_idx on public.vehicles(status);
create index if not exists vehicles_make_model_idx on public.vehicles(make, model);
create index if not exists vehicles_price_idx on public.vehicles(price_usd);
create index if not exists vehicles_year_idx on public.vehicles(year desc);

create table if not exists public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists vehicle_images_vehicle_idx
  on public.vehicle_images(vehicle_id, position);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;

drop policy if exists "Profile owner can read profile" on public.profiles;
create policy "Profile owner can read profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "Public can read live vehicles" on public.vehicles;
create policy "Public can read live vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (status = 'live' or public.is_staff(auth.uid()));

drop policy if exists "Staff can insert vehicles" on public.vehicles;
create policy "Staff can insert vehicles"
  on public.vehicles for insert
  to authenticated
  with check (public.is_staff(auth.uid()) and created_by = auth.uid());

drop policy if exists "Staff can update vehicles" on public.vehicles;
create policy "Staff can update vehicles"
  on public.vehicles for update
  to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff can delete vehicles" on public.vehicles;
create policy "Staff can delete vehicles"
  on public.vehicles for delete
  to authenticated
  using (public.is_staff(auth.uid()));

drop policy if exists "Public can read live vehicle images" on public.vehicle_images;
create policy "Public can read live vehicle images"
  on public.vehicle_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.vehicles
      where vehicles.id = vehicle_images.vehicle_id
        and (vehicles.status = 'live' or public.is_staff(auth.uid()))
    )
  );

drop policy if exists "Staff can insert vehicle images" on public.vehicle_images;
create policy "Staff can insert vehicle images"
  on public.vehicle_images for insert
  to authenticated
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff can update vehicle images" on public.vehicle_images;
create policy "Staff can update vehicle images"
  on public.vehicle_images for update
  to authenticated
  using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));

drop policy if exists "Staff can delete vehicle images" on public.vehicle_images;
create policy "Staff can delete vehicle images"
  on public.vehicle_images for delete
  to authenticated
  using (public.is_staff(auth.uid()));

grant select on public.profiles to authenticated;
grant select on public.vehicles to anon;
grant select, insert, update, delete on public.vehicles to authenticated;
grant select on public.vehicle_images to anon;
grant select, insert, update, delete on public.vehicle_images to authenticated;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'vehicle-images',
  'vehicle-images',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Staff can upload vehicle images" on storage.objects;
create policy "Staff can upload vehicle images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images' and public.is_staff(auth.uid()));

drop policy if exists "Staff can update stored vehicle images" on storage.objects;
create policy "Staff can update stored vehicle images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_staff(auth.uid()))
  with check (bucket_id = 'vehicle-images' and public.is_staff(auth.uid()));

drop policy if exists "Staff can delete stored vehicle images" on storage.objects;
create policy "Staff can delete stored vehicle images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_staff(auth.uid()));

-- Promote the first approved user once:
-- update public.profiles set role = 'admin' where email = 'YOUR_ADMIN_EMAIL';
