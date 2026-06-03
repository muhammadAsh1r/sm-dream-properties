# sm-dream-properties

Premium real estate and logistics platform for SM Dream Properties — public marketing site, property listings, and enterprise admin dashboard.

## Stack

- **Next.js 15** (App Router)
- **Prisma 7** + **PostgreSQL** (Supabase)
- **Clerk** authentication
- **Tailwind CSS** + shadcn/ui

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Install dependencies and push the database schema:

```bash
npm install
npm run db:push
```

3. Run the development server:

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio |

## Environment variables

See `.env.local` for required keys: `DATABASE_URL`, `DIRECT_URL`, Clerk keys, and optional PostHog analytics.
