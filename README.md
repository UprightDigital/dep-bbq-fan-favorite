# DEP BBQ Fan Favorite Voting

A QR-code voting platform for the Daniel Energy Partners Permian Basin BBQ
Cook-Off's Fan Favorite award. Each cook team gets its own QR code at their
booth; fans scan it and rate that team 1&ndash;5 stars, and the rating is
added to that team's live-updating leaderboard total.

**Stack:** Next.js (deployed on Vercel) + Supabase (Postgres + Realtime for
the live leaderboard). No login, no app install &mdash; a fan just scans and taps
a star.

## How it works

- Every team has a row in a `teams` table (`id`, `name`, `votes`, `logo_url`).
  `votes` holds the **cumulative sum of every star rating** submitted for
  that team (three 5-star ratings = 15, not 3).
- Each booth's QR code points to `https://your-domain.com/vote/{teamId}`.
- Tapping a star calls a Postgres function, `add_team_rating(team_id, rating)`,
  which validates the rating is between 1 and 5 and adds it to that team's
  running total. Fans' browsers only have the public ("anon") key, and that
  key is not allowed to write to the `teams` table directly &mdash; only to call
  this function &mdash; so nobody can fake a score via the API.
- As you asked, there's **no per-device rating limit**: every scan + rating
  counts. If you want to add a limit later (e.g. one rating per team per
  device), that would go in `vote-button.tsx` using a cookie/localStorage
  check.
- `/leaderboard` subscribes to Supabase Realtime, so it updates live as
  ratings come in &mdash; good for projecting on a screen at the event.
- `/admin/qrcodes` generates and prints all the QR codes, using whatever
  domain the app is actually deployed on (no need to know the URL in advance).

## 1. Create the Supabase project

1. In your Supabase account, create a new project for this event (separate
   from your other project).
2. Open the **SQL Editor** and run each migration file in `supabase/migrations/`
   **in order** (001, then 002, then 003). `001_init.sql` creates the schema
   and seeds placeholder teams; `002_real_teams.sql` replaces them with the
   real roster and logos; `003_star_ratings.sql` switches voting over to the
   1&ndash;5 star system described above.
3. Go to **Project Settings -> API** and copy the **Project URL** and the
   **anon / public key**.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ADMIN_PASSCODE=pick-something-private
```

`NEXT_PUBLIC_ADMIN_PASSCODE` gates the `/admin/qrcodes` page. It's a light
deterrent only (it's baked into the public JS bundle, so it's not real
security) &mdash; good enough to keep casual visitors off the page, not to
protect anything sensitive.

## 3. Run it locally

```
npm install
npm run dev
```

Visit `http://localhost:3000`. Try `/vote/1` to cast a test vote and
`/leaderboard` to watch it update live.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, "Add New Project" and import that repo.
3. Add the same three environment variables from `.env.local` in the
   Vercel project's Settings -> Environment Variables.
4. Deploy. Vercel gives you a public URL &mdash; that's what your QR codes will
   point to.

## 5. Rename the placeholder teams

Right now every team is named "Team 1" through "Team 110". Once you have the
real team list, open the Supabase **Table Editor -> teams** and either:

- Edit each row's `name` field directly (fine for a one-time setup), or
- Use **Insert -> Import data from CSV** to bulk-replace names if you export
  the table, edit `name` in a spreadsheet, and re-import.

Team `id` numbers don't need to match anything &mdash; they're just the
identifier baked into each QR code, so keep them stable once you've printed
QR codes.

## 6. Generate and print the QR codes

1. Visit `/admin/qrcodes` on your deployed site and enter the passcode.
2. Confirm the team names look right.
3. Click **Print all 110 cards** (or use your browser's "Save as PDF" in the
   print dialog) and cut out one card per booth.

Regenerate/reprint any time team names change &mdash; the QR codes themselves
don't need to change unless a team's `id` changes.

## 7. Before event day

- Do a full dry run: scan a real printed QR code with a phone, vote, and
  confirm it shows up on `/leaderboard`.
- Project `/leaderboard` on a screen if you want a live results display.
- Double-check `NEXT_PUBLIC_ADMIN_PASSCODE` isn't left as the default.
