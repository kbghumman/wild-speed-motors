# Wild Speed Motors Supabase setup

The application expects:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Database/schema setup lives in:

`supabase/migrations/202609300001_inventory.sql`

The migration creates staff roles, vehicles, image metadata, RLS policies,
and the public `vehicle-images` storage bucket.

## First admin

Create the first user in Supabase Auth, then promote that profile:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

There is intentionally no public sign-up page. Accounts without an
`admin` or `staff` role cannot access the dealer console.

## Vercel

Add the two environment variables above to the Vercel project and redeploy once.
