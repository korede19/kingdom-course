# Kingdom Culture Academy

A 10-lesson learning-management app: auth, lesson content, quizzes with
pass/retry cooldowns, a certificate, a shop, and a donations page. Built with
Next.js 16 (App Router, TypeScript), Prisma + Postgres, and CSS Modules.

## Getting started

1. **Database.** Point `DATABASE_URL` in `.env` at a Postgres instance. For
   local dev, either:
   - Use the Homebrew/system Postgres already on this machine (matches the
     default in `.env.example`), or
   - `docker compose up -d` (requires Docker Desktop running) for a
     containerized Postgres matching the same credentials.

   Copy the example if you don't have a `.env` yet:

   ```bash
   cp .env.example .env
   ```

2. **Install dependencies, migrate, seed:**

   ```bash
   npm install
   npx prisma migrate dev
   npm run db:seed
   ```

   This creates:
   - A demo course user: `demo@kingdom.com` / `demo1234`
   - A super admin account: email defaults to `admin@kingdomcultureacademy.local`
     with a random password printed once to the console. To control these
     instead, set `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars before seeding
     (e.g. `ADMIN_EMAIL=you@co.com ADMIN_PASSWORD=... npm run db:seed`).
     Re-running the seed script is a no-op if that admin email already exists
     — to rotate the password, update it directly via `npx prisma studio`
     (hash a new one with `bcryptjs`) or delete the row and reseed.

3. **Run the app:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying

Swap `DATABASE_URL` for your production Postgres connection string (e.g. a
Railway Postgres instance) — no code changes needed. Run
`npx prisma migrate deploy` against it before first boot.

## Project structure

- `app/` — routes (App Router).
  - `app/(app)/` — the authenticated *course* shell (sidebar + `requireUser()`
    gate); `app/login/` is its public entry point.
  - `app/admin/(dashboard)/` — the authenticated *admin* shell (separate
    sidebar + `requireAdmin()` gate); `app/admin/login/` is its public entry
    point. Entirely separate credential system from the course side — an
    admin session cookie grants no access to `/dashboard` etc., and vice
    versa.
- `actions/` — Server Actions (`"use server"`) for auth, admin auth, lesson
  progress, shop, and donations. All mutations validate/authorize inside the
  action itself, not just in the UI.
- `lib/` — Prisma client, session/cookie handling (`session.ts` for users,
  `admin-session.ts` for admins), password hashing, the ported lesson content
  and quiz data, progress-calculation helpers, and admin dashboard queries
  (`admin-stats.ts`).
- `components/` — shared UI (icon set, progress bar, sidebar, admin sidebar,
  etc.), each paired with a CSS Module.
- `prisma/` — schema and the seed script (demo user + super admin).
- `proxy.ts` — Next 16's replacement for `middleware.ts`; does a cheap
  cookie-presence redirect only, for both the user and admin cookie. Real
  session verification happens in `requireUser()`/`requireAdmin()` (called
  from the respective layouts and every mutating Server Action).

## Admin dashboard

Visit `/admin/login` (not linked from the course UI) and sign in with the
super admin credentials from the seed step above. The dashboard shows:

- Aggregate stats: total users, certificates earned, average completion,
  shop revenue, donation totals.
- A searchable, sortable, paginated user list (name, email, join date,
  lesson/badge progress, certificate status, last activity).
- A per-user detail page: full 10-lesson progress breakdown (read/passed,
  best score, attempts, badge, last updated) plus that user's orders and
  donations.

There's no self-service admin invite flow by design — additional admins are
created the same way as the first one (seed script env vars, or a row insert
via `npx prisma studio`), keeping privilege escalation out of the UI surface.

## Notes

- Quiz correct answers/explanations are stripped server-side before reaching
  the client; grading happens only inside the `submitQuiz` Server Action.
- Shop checkout and donations are simulated (no payment provider wired up) —
  they write real `Order`/`Donation` rows and show a confirmation, but no
  money moves.
- Admin "tracking" is aggregate-only — it surfaces what the app already
  records (progress, orders, donations, timestamps). There's no separate
  page-view/event-log table; that'd be a follow-up if you need a timeline
  view per user rather than current-state snapshots.
