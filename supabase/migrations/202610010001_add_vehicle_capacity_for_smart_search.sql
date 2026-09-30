alter table public.vehicles
  add column if not exists seats smallint,
  add column if not exists doors smallint;

alter table public.vehicles
  drop constraint if exists vehicles_seats_check,
  add constraint vehicles_seats_check check (seats is null or seats between 1 and 12);

alter table public.vehicles
  drop constraint if exists vehicles_doors_check,
  add constraint vehicles_doors_check check (doors is null or doors between 2 and 6);

create index if not exists vehicles_live_price_seats_idx
  on public.vehicles (price_usd, seats)
  where status = 'live';
