
## 1. Who this is for and why

- I'm Alex, a job seeker targeting **junior / entry-level / new grad software developer** roles.
- My habit goal is **5 quality, tailored applications a day**, not mass applying.
- This tool replaces scattered notes and tabs with one place to (1) track every application and (2) tailor my resume and cover letter to each posting quickly with AI.
- It should also be a **portfolio project**: clean code, a good README, tests, and something I can explain confidently in an interview.

## 2. Ground rules (non-goals)

- **No auto-applying.** The app never submits applications for me.
- **No scraping** of LinkedIn, Indeed or other job boards (it breaks their terms of service). I paste job posts in myself.
- **AI output is a draft.** I always review and edit before using anything. The AI must never invent experience, skills or metrics that aren't in my master resume.
- Single user (just me). No sign-up or multi-user accounts needed for v1.

## 3. Features

### 3.1 Application tracker

Each application has these fields:

| Field | Type | Notes |
|---|---|---|
| company | text | required |
| role_title | text | required |
| job_url | url | optional |
| location / remote | text | e.g. "Remote", "Toronto (hybrid)" |
| source | enum | LinkedIn, Indeed, Wellfound, Company site, Referral, Other |
| date_found | date | |
| date_applied | date | empty until applied |
| status | enum | Saved → Applied → Online Assessment → Interviewing → Offer / Rejected / Ghosted / Withdrawn |
| resume_version | text | which resume I sent (lets me see what gets callbacks) |
| contact_name / contact_info | text | recruiter or referral |
| follow_up_date | date | auto-set to date_applied + 7 days; editable |
| job_description | long text | pasted posting, used by the tailoring helper |
| notes | long text | |

Views and behavior:
- **Table / list view** with sort and filter by status, source and date.
- **Add / edit / delete** applications; quick status change from the list.
- **Today panel:** applications sent today vs. my goal of 5, and a list of **follow-ups due** (follow_up_date ≤ today and status still Applied).
- **Simple stats:** total applied, response rate (moved past Applied), applications per week, and callbacks by resume_version and by source.
- **Export to CSV** (and import from CSV) so my data is never locked in.
- Works well on a phone browser (responsive layout).

### 3.2 Email sync (Gmail) — automatic tracking

Goal: application confirmations, rejections, assessment invites and interview requests in my inbox update the tracker without manual entry.

- **Connect Gmail** with Google OAuth using the **read-only** scope (`gmail.readonly`). Never send, delete or modify email.
- **Sync** on a button press (and optionally on a schedule when the app is running). Only fetch recent messages that match a job-related search, e.g. from ATS senders (greenhouse.io, lever.co, myworkdayjobs.com, ashbyhq.com, smartrecruiters.com, icims.com) or subjects like "application", "thank you for applying", "interview", "assessment", "unfortunately". Keep the query in config so I can tune it.
- **Classify and extract** each matched email (rules first, Claude API as a fallback for ambiguous ones): type (Applied confirmation / Online assessment / Interview request / Rejection / Offer / Other), company, role title, date.
- **Match** to an existing application by company + role (fuzzy match). If none exists, create a new one as Applied.
- **Review inbox, not silent changes:** proposed creates and status changes go into a "Suggested updates" list that I approve or dismiss with one click. After I trust it, a setting can auto-apply high-confidence matches.
- Store only what's needed: Gmail message id (to avoid duplicates), sender, subject, date, a short snippet, and the classification. Don't store full email bodies. Only send matched job emails to Claude, never the whole inbox.
- Show a "last synced" time and a link to open the original email in Gmail.
- Setup notes for the README: create a Google Cloud project, enable the Gmail API, create an OAuth client, and add myself as a **test user** (personal use doesn't need Google verification, but test-mode refresh tokens expire after about 7 days, so the app must handle re-connecting gracefully). Keep `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` in `.env.local`, and store OAuth tokens server-side only.
- Tests: classification rules against sample emails (fixtures with fake data), duplicate prevention, and matching logic.

### 3.3 AI tailoring helper

- A **Master resume** settings page where I paste my full resume once (plain text / Markdown). It's stored locally and reused.
- On any application (or standalone), I paste a job description and click **Tailor**. The app calls the Claude API and returns:
  1. **Match summary:** 2–3 sentences on how well I fit, plus gaps to be honest about.
  2. **Keywords:** the key skills and terms in the posting, marked as "in my resume" or "missing" (helps with ATS filters).
  3. **Tailored bullets:** 5–6 resume bullets rewritten from my *existing* experience to emphasize what this job wants.
  4. **Cover letter draft:** under 250 words, specific to the company and role, plain and genuine in tone (no buzzword filler).
  5. **Follow-up message draft:** a short, polite note to send a recruiter 7–10 days after applying.
- Each section has a **Copy** button. Results are **saved with the application** so I can revisit them.
- Prompt rules (put these in the system prompt):
  - Only use facts present in the master resume. If the job asks for something I don't have, list it under gaps; never fabricate.
  - Target a junior developer audience; keep language concrete and honest.
  - Return structured JSON so the UI can render each section.

## 4. Suggested tech stack (Claude Code may propose alternatives; explain trade-offs)

- **Next.js (App Router) + TypeScript** for frontend and API routes in one project.
- **SQLite** with **Prisma** (or Drizzle) for storage. Zero setup, one local file.
- **Tailwind CSS** for styling.
- **Anthropic TypeScript SDK** (`@anthropic-ai/sdk`) called **only from server-side API routes**. Use a current Claude model, set by an env var (`CLAUDE_MODEL`) so it's easy to change.
- **Vitest** for unit tests (follow-up date logic, stats, CSV import/export, prompt/JSON parsing).
- Secrets in `.env.local` (`ANTHROPIC_API_KEY`), with a committed `.env.example`. `.env*` and the SQLite file are in `.gitignore`.

Note: Claude API usage is billed separately from a Claude subscription. I'll need an API key from console.anthropic.com. Keep calls cheap: one call per Tailor click, and no automatic calls.

## 5. Milestones

1. **M1 — Tracker MVP:** project setup, database schema, add/edit/delete/list applications, status changes, filters.
2. **M2 — Daily habit:** Today panel (x/5 applied today, follow-ups due), auto follow-up dates.
3. **M3 — Tailoring helper:** master resume page, Tailor button, structured results saved per application, copy buttons, clear error handling (missing API key, API errors).
4. **M4 — Insights and data:** stats page, CSV export/import.
5. **M5 — Email sync:** Gmail connect, sync, classification, matching, and the Suggested updates review list (see 3.2).
6. **M6 — Portfolio polish:** README (what it is, screenshots, how to run, tech decisions), tests passing, lint clean, optional deploy (e.g. Vercel with a hosted DB, or keep local-only).

## 6. Acceptance criteria

- `npm install && npm run dev` runs the app locally with no other setup beyond `.env.local`.
- I can log an application in under 30 seconds.
- Tailor returns all five sections for a pasted job post, and nothing in it contradicts my master resume.
- The API key never reaches the browser (check network requests).
- After sync, a real "thank you for applying" or rejection email shows up as a suggested update matched to the right application, and syncing twice creates no duplicates.
- `npm test` passes; README explains setup and design choices.

## 7. How I want Claude Code to work with me

- I'm a junior developer **learning** through this project. Work one milestone at a time, explain key decisions and unfamiliar concepts briefly, and point out things worth mentioning in interviews.
- Ask before adding big dependencies or changing the stack.
- Commit after each milestone with clear commit messages.
