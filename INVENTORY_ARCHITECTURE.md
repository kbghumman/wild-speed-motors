# Inventory architecture

The Supabase database is the only source of truth for vehicle inventory.

## Admin to public flow

1. Staff creates or edits a vehicle in the dealer console.
2. The dealer console writes the vehicle to `public.vehicles`.
3. Vehicle photos are stored in the `vehicle-images` bucket and indexed in `public.vehicle_images`.
4. A vehicle is customer-visible only when `status = 'live'`.
5. Every public inventory surface queries the same Supabase project directly:
   - homepage new arrivals
   - /cars
   - /cars/[slug]
   - manufacturer counts and filters
   - budget ranges
   - collections
6. There is no production demo-inventory fallback.

## Freshness

Customer inventory routes are dynamic and read Supabase on each request. This deliberately prioritizes inventory correctness and consistency across deployments over long-lived application caching. Next.js image optimization remains enabled for photo-delivery performance.

## Public Supabase configuration

The project URL and publishable key have safe public defaults in `src/lib/supabase/env.ts`. Environment variables override these defaults when present. Supabase publishable keys are intended for public/browser use; authorization is enforced by Row Level Security.
