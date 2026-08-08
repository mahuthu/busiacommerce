# Busia Fridge World

React + Vite storefront for Busia Fridge World appliances, with a Supabase-backed admin portal.

## Scripts

```bash
npm run dev        # local storefront + admin
npm run build      # production build
npm run seed       # upload src/data/products.json into Supabase
npm run products   # rebuild products.json from Excel + images/
```

## Admin portal

See [docs/ADMIN_SETUP.md](docs/ADMIN_SETUP.md) for Supabase setup, seeding, and Vercel env vars.

- Storefront: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
