# Admin portal setup (Supabase)

The storefront and `/admin` dashboard share one product catalogue in Supabase.

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (seed script only; never put this in Vite client code)

## 2. Run the database migration

In Supabase **SQL Editor**, paste and run:

[`supabase/migrations/001_products.sql`](../supabase/migrations/001_products.sql)

This creates the `products` table, RLS (public read, authenticated write), and the public `product-images` storage bucket + policies.

## 3. Create the admin user

1. Supabase → **Authentication → Users → Add user**
2. Create with email + password (the client’s login).
3. **Authentication → Providers → Email**: keep Email enabled.
4. Disable public sign-ups if available (**Authentication → Settings** → turn off “Allow new users to sign up”) so only users you create can log in.

## 4. Local env

```bash
cp .env.example .env
```

Fill in the three keys, then:

```bash
npm run seed
npm run dev
```

- Storefront: [http://localhost:5173/](http://localhost:5173/)
- Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

Until Supabase is configured / seeded, the storefront falls back to `src/data/products.json`.

## 5. Vercel

In the Vercel project → **Settings → Environment Variables**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy. Also ensure SPA rewrites are present (`vercel.json`) so `/admin` works on refresh.

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel client env.
