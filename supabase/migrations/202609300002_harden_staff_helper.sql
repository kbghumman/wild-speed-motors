-- Hardening follow-up: keep staff helper out of the exposed public API schema.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_staff()
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
      and role in ('staff', 'admin')
  );
$$;

revoke all on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated, service_role;

drop policy if exists "Public can read live vehicles" on public.vehicles;
create policy "Public can read live vehicles"
  on public.vehicles for select
  to anon, authenticated
  using (status = 'live' or (select private.is_staff()));

drop policy if exists "Staff can insert vehicles" on public.vehicles;
create policy "Staff can insert vehicles"
  on public.vehicles for insert
  to authenticated
  with check ((select private.is_staff()) and created_by = auth.uid());

drop policy if exists "Staff can update vehicles" on public.vehicles;
create policy "Staff can update vehicles"
  on public.vehicles for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

drop policy if exists "Staff can delete vehicles" on public.vehicles;
create policy "Staff can delete vehicles"
  on public.vehicles for delete
  to authenticated
  using ((select private.is_staff()));

drop policy if exists "Public can read live vehicle images" on public.vehicle_images;
create policy "Public can read live vehicle images"
  on public.vehicle_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.vehicles
      where vehicles.id = vehicle_images.vehicle_id
        and (vehicles.status = 'live' or (select private.is_staff()))
    )
  );

drop policy if exists "Staff can insert vehicle images" on public.vehicle_images;
create policy "Staff can insert vehicle images"
  on public.vehicle_images for insert
  to authenticated
  with check ((select private.is_staff()));

drop policy if exists "Staff can update vehicle images" on public.vehicle_images;
create policy "Staff can update vehicle images"
  on public.vehicle_images for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));

drop policy if exists "Staff can delete vehicle images" on public.vehicle_images;
create policy "Staff can delete vehicle images"
  on public.vehicle_images for delete
  to authenticated
  using ((select private.is_staff()));

drop policy if exists "Staff can upload vehicle images" on storage.objects;
create policy "Staff can upload vehicle images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images' and (select private.is_staff()));

drop policy if exists "Staff can update stored vehicle images" on storage.objects;
create policy "Staff can update stored vehicle images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images' and (select private.is_staff()))
  with check (bucket_id = 'vehicle-images' and (select private.is_staff()));

drop policy if exists "Staff can delete stored vehicle images" on storage.objects;
create policy "Staff can delete stored vehicle images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images' and (select private.is_staff()));

revoke all on function public.is_staff_current() from public, anon, authenticated;
revoke all on function public.is_staff(uuid) from public, anon, authenticated;
