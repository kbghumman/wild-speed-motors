-- Upgrade first-party analytics to VIN/stock-level reporting.
-- Production migration applied through Supabase on 2026-10-03.

alter table public.analytics_events
  add column if not exists vehicle_id uuid references public.vehicles(id) on delete set null;

update public.analytics_events a
set vehicle_id = v.id
from public.vehicles v
where a.vehicle_id is null and a.vehicle_slug = v.slug;

create index if not exists analytics_events_vehicle_id_time_idx
  on public.analytics_events (vehicle_id, occurred_at desc)
  where vehicle_id is not null;

-- record_analytics_event now resolves the stable vehicle UUID from the public slug.
-- get_inventory_analytics(days) returns global KPIs plus unit-level inventory performance.
-- get_vehicle_analytics_detail(slug, days) returns a complete per-vehicle profile:
-- listing impressions/clicks, VDP views, repeat viewers, gallery depth, engagement time,
-- scroll depth, CTA attribution, daily demand, photo performance, sources/devices/countries,
-- and the anonymized vehicle event stream.
--
-- The canonical function definitions live in the production database migration history.
