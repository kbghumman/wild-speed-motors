-- Separate anonymous and authenticated read policies.
-- Anonymous visitors may read only live inventory.
-- Authenticated staff may also read non-live inventory through the private helper.

drop policy if exists "Public can read live vehicles" on public.vehicles;
drop policy if exists "Authenticated can read vehicles" on public.vehicles;

create policy "Anon can read live vehicles"
  on public.vehicles for select
  to anon
  using (status = 'live');

create policy "Authenticated can read vehicles"
  on public.vehicles for select
  to authenticated
  using (status = 'live' or (select private.is_staff()));

drop policy if exists "Public can read live vehicle images" on public.vehicle_images;
drop policy if exists "Authenticated can read vehicle images" on public.vehicle_images;

create policy "Anon can read live vehicle images"
  on public.vehicle_images for select
  to anon
  using (
    exists (
      select 1
      from public.vehicles
      where vehicles.id = vehicle_images.vehicle_id
        and vehicles.status = 'live'
    )
  );

create policy "Authenticated can read vehicle images"
  on public.vehicle_images for select
  to authenticated
  using (
    exists (
      select 1
      from public.vehicles
      where vehicles.id = vehicle_images.vehicle_id
        and (vehicles.status = 'live' or (select private.is_staff()))
    )
  );
