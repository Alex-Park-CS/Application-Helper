# Application Helper

A personal job-application tracker with AI-assisted resume tailoring, built for a habit of 5 quality applications a day.

> Work in progress. Milestone 1 (tracker MVP) is done; see `claude.md` for the roadmap.

## Run locally

Requires Node.js 22+.

```bash
cp .env.example .env.local   # then edit if needed
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

## Stack

Next.js 16 (App Router, Server Actions, Cache Components) · TypeScript · SQLite + Prisma 7 · Zod · Tailwind CSS 4 · Vitest

## Project layout

```
prisma/schema.prisma          Data model (single source of truth for the DB)
src/lib/applications/
  constants.ts                Allowed statuses, sources, sort keys
  schema.ts                   Zod validation: form input -> typed data
  filters.ts                  URL search params -> Prisma query (pure, tested)
  queries.ts                  Read functions (server only)
  actions.ts                  Server Actions: create / update / delete / status
src/components/               UI components
src/app/                      Routes: list, new, edit
```
