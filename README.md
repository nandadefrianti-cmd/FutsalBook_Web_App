# FutsalBook

This is a futsal court booking web application built with [React](https://react.dev), [Vite](https://vitejs.dev) and [Tailwind CSS](https://tailwindcss.com), using [Supabase](https://supabase.com) (PostgreSQL, Auth and an auto-generated REST API) as its backend.

Final project for **IK301 (Advanced Database Systems)** and **IK102 (Software Development Fundamentals)** - Group 10, Universitas Cakrawala.

**Live application:** [FILL IN: hosted URL] &nbsp;|&nbsp; **Submission tag:** `final-submission`

> **Backend note.** All business logic (booking transaction, price calculation, cancellation, reports) lives in the database as SQL functions, triggers and Row Level Security policies. The `backend/` folder is an early Express prototype that the app does **not** use.

# Getting Started

> **Note**: Make sure you have Node.js v18+ (with npm v9+) installed and a free [Supabase](https://supabase.com) account before proceeding.

## Step 1: Set up Supabase

First, you will need a Supabase project that holds the database and the API.

1. Create a new project at https://supabase.com.
2. Go to **Authentication > Sign In / Providers > Email** and turn **Confirm email OFF**.
3. Go to **Project Settings > API** and copy the **Project URL** and the **anon / publishable key**. Never copy or use the secret key.
4. Open the **SQL Editor** and run the files in `database/` **in this order**:

```text
00_reset.sql      # safe on an empty project
01_schema.sql     # 6 tables, constraints, indexes
02_functions.sql  # create_booking, batalkan_booking, reports, ...
03_triggers.sql   # audit trigger -> booking_logs
04_policies.sql   # choose "Run and enable RLS"
05_seed.sql       # venue + 3 courts
```

Check that Row Level Security is on (all six tables must show `true`):

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

## Step 2: Start the app

With Supabase ready, clone the repository and configure the frontend:

```bash
git clone https://github.com/nandadefrianti-cmd/final_submission_kelompok_10.git
cd final_submission_kelompok_10/frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

Then start the Vite dev server:

```bash
npm run dev
```

## Step 3: Create the accounts and try the app

There are no built-in accounts and no password is stored in this repository. Ready-made evaluator accounts for the hosted demo are listed in the README document submitted through the LMS.

- **Player:** click *Daftar* and register (password of at least 6 characters).
- **Admin:** register a normal account, open `database/06_admin.sql`, replace `GANTI_DENGAN_EMAIL_ADMIN` with that email and run it in the SQL Editor. Log out and in again: you land on the admin dashboard.

Quick check: log in as a player > Jadwal Lapangan > pick a slot > QRIS > Booking Sekarang. Log in as admin > Konfirmasi Pembayaran shows `FB-000001` > Set Lunas > Laporan shows the revenue.

## Run the tests

```bash
cd frontend
npm test
```

`npm test` runs `vitest run`: 12 automated tests of the service layer (booking, duplicate slot, weekday/weekend price, cancellation, validation, tariff, admin calls). The Supabase client is mocked, so no network is needed.

## Congratulations!

You have the full flow running: player books a slot, admin confirms the payment, the report updates.

### Now what?

- Database design: six tables (`profiles`, `venues`, `courts`, `bookings`, `payments`, `booking_logs`), the ERD is in `docs/erd.png`.
- Integrity: partial unique index `uq_slot_aktif` (one active booking per court, date and hour), `CHECK` constraints, foreign keys.
- Transaction: `create_booking` inserts the booking and its payment in one transaction.
- Trigger: `trg_booking_status_audit` logs every status change to `booking_logs`.
- Index evidence: run `database/demo_ik301.sql` to see `EXPLAIN ANALYZE` before and after `idx_court_tanggal`.
- Analytics: `laporan_pendapatan` and `laporan_jam_ramai` (joins + aggregation).
- Security: RLS on every table; admin-only functions check `profiles.role`.

### Project structure

```text
database/        00-06 SQL files, demo_ik301.sql
frontend/src/    lib/ config/ services/ context/ pages/ (Admin/) tests/
docs/            ERD, validation notes, competitor map
backend/         unused early prototype (Express)
```

### Known limitations

- Payment is **simulated** (QRIS, GoPay, DANA, OVO); no money moves and there is no proof upload.
- Weekend means Saturday and Sunday; national holidays are priced as normal days.
- One venue, fixed one-hour slots, no refunds; data refreshes on page load, not live.

# Troubleshooting

If you're having issues getting the above steps to work, check these common problems:

| Symptom | Fix |
|---|---|
| `Failed to resolve import "../services/..."` | The folders `services/`, `lib/`, `config/` or `context/` were not copied into `frontend/src/`. |
| Blank page or "Invalid API key" | Check `frontend/.env`, then **restart** `npm run dev` (Vite reads `.env` only at start). |
| After registering: "cek email untuk konfirmasi" | Turn **Confirm email OFF** in Supabase (Step 1). |
| Admin login opens the player pages | Run `database/06_admin.sql` with the right email, then log out and in again. |
| Booking fails with "permission denied" | Re-run `04_policies.sql` and choose "Run and enable RLS". |
| Admin shows old data that is not in the database | Clear the browser's local storage (`localStorage.clear()` in the console) and make sure `pages/Dashboard.jsx` is the new version without `localStorage`. |

# AI Usage

In compliance with Section 7 of the exam brief, generative AI tools were used:

- **Google Stitch:** UI design and visual reference.
- **Gemini:** ideas, explanations of technical concepts and suggestions.
- **ChatGPT:** Tailwind CSS UI components, early drafts of RLS policies and Vitest boilerplate.
- **Claude (Anthropic):** the final database SQL (schema, functions, triggers, RLS, seed), the frontend service layer and admin pages, the Vitest tests, adapting the existing UI to the database, debugging.

# Learn More

To learn more about the tools used here, take a look at the following resources:

- [React Documentation](https://react.dev) - learn more about React.
- [Vite Guide](https://vitejs.dev/guide/) - the dev server and build tool.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first styling.
- [Supabase Documentation](https://supabase.com/docs) - Auth, PostgREST, Row Level Security and SQL functions.
- [Vitest](https://vitest.dev) - the test runner used by `npm test`.

Developed for academic purposes as part of the IK301 and IK102 final project.