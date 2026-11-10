# Application Helper

[![CI](https://github.com/Alex-Park-CS/Application-Helper/actions/workflows/ci.yml/badge.svg)](https://github.com/Alex-Park-CS/Application-Helper/actions/workflows/ci.yml)

A personal job-application tracker with AI-assisted resume tailoring, built for a habit of 5 quality applications a day.

> Work in progress. Roadmap:
>
> - [x] **M1** Tracker: add, edit, delete, filter and sort applications
> - [ ] **M2** Today panel: daily goal progress and follow-ups due
> - [ ] **M3** AI tailoring: match summary, keywords, bullets and cover letter from a job post (Claude API)
> - [ ] **M4** Stats and CSV import/export
> - [ ] **M5** Gmail sync: suggested status updates from application emails
> - [ ] **M6** Polish: screenshots, docs, optional deploy

## Run locally

Requires Node.js 22+.

```bash
cp .env.example .env.local   # then set APP_PASSWORD and SESSION_SECRET
npm install                  # also generates the Prisma client
npm run dev                  # applies DB migrations, then starts http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (runs pending migrations first) |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create + apply a migration after editing `prisma/schema.prisma` |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run db:deploy` | Apply migrations to the Turso database (runs automatically on Vercel) |

## Deploy (Vercel + Turso)

The app is single-user and protected by one password. Every page and Server Action requires a signed session cookie.

1. **Database:** create a database at [turso.tech](https://turso.tech) and copy its URL (`libsql://…`) and an auth token.
2. **Hosting:** import this repo at [vercel.com/new](https://vercel.com/new) and add these environment variables:
   `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `APP_PASSWORD`, `SESSION_SECRET` (see `.env.example`).
3. Deploy. The build command in `vercel.json` applies pending migrations to Turso first, then builds. Every push to `main` redeploys.

Prisma Migrate can't connect to Turso yet, so `scripts/migrate-turso.mjs` applies the same `prisma/migrations` SQL files and records which ones ran. Locally, Prisma manages the SQLite file as usual; the libSQL driver adapter handles both.

## Stack

Next.js 16 (App Router, Server Actions, Cache Components) · TypeScript · SQLite / Turso (libSQL) + Prisma 7 · Zod · Tailwind CSS 4 · Vitest

## Project layout

```
prisma/schema.prisma          Data model (single source of truth for the DB)
src/lib/applications/
  constants.ts                Allowed statuses, sources, sort keys
  schema.ts                   Zod validation: form input -> typed data
  filters.ts                  URL search params -> Prisma query (pure, tested)
  queries.ts                  Read functions (server only)
  actions.ts                  Server Actions: create / update / delete / status
src/lib/auth/                 Password login: signed session tokens, requireSession() guard
src/proxy.ts                  Redirects logged-out requests to /login
src/components/               UI components
src/app/(app)/                Logged-in routes: list, new, edit (shared header)
src/app/login/                Login page
scripts/migrate-turso.mjs     Applies migrations to Turso in production
```

## License

MIT
