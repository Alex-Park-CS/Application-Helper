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

## License

MIT
