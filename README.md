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
   **in order** (001 through 009). `001_init.sql` creates the schema and
   seeds placeholder teams; `002_real_teams.sql` replaces them with the real
   roster and logos; `003_star_ratings.sql` switches voting over to the
   1&ndash;5 star system described above; `004_more_logos_and_teams.sql`
   backfills logos that arrived after the original roster and adds 6 cook
   teams (BPX, Dark Vision, Gulf States, Moffitt Services, Superior, Wall
   Street) that signed up later; `005_more_logos.sql` backfills logos for
   another 16 teams added after that; `006_fix_broken_logo_paths.sql` fixes
   4 teams whose logo paths pointed at a folder that doesn't exist in this
   app; `007_moffitt_name_fix.sql` corrects team 113's name to Moffitt
   Services; `008_dynamic_qr_codes.sql` adds the optional `qr_target`
   override and locks every team's `scan_code` (see section 6); `009_sync_team_list.sql` syncs the roster to the Oct 12 master list (113 cook teams incl. Merit Advisors and Meyer, 22 hospitality tents), hides teams no longer on it and adds missing logos.
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

## 5. Adding or editing teams later

The real roster is already loaded (see migrations 002, 004, and 005). To add
a team that signs up later or fix a name/logo, open the Supabase
**Table Editor -> teams** and either:

- Edit a row's `name` or `logo_url` directly, or
- Insert a new row with the next unused `id`, a `name`, and `votes` set to 0.

Team `id` numbers don't need to match anything &mdash; they're just the
identifier baked into each QR code, so keep them stable once you've printed
QR codes for a team.

## 6. Generate, send and print the QR codes (dynamic)

QR codes are **dynamic and permanent**. Each one encodes
`https://dep-bbq-fan-favorite.vercel.app/q/{scan_code}`, where `scan_code` is
the team's code in the `teams` table (e.g. `DEP26-3BB36981`). The `/q` route
looks the code up when it's scanned and redirects:

- to `teams.qr_target` if set (a site path like `/leaderboard`, or a full
  `https://` URL), otherwise
- to that team's vote page, `/vote/{id}`.

So you can rename a team, swap its logo, or re-point its code without
reprinting. `scan_code` is locked by a database trigger (migration 008) and
cannot be edited. The printed address is fixed to the production domain
(override with `NEXT_PUBLIC_SITE_URL`), so it doesn't matter which URL you
open the admin page from.

1. Visit `/admin/qrcodes` on your deployed site and enter the passcode.
2. Filter to **All**, **Cook teams** or **Hospitality**.
3. **Download PNG** on any card, or **Download (ZIP)** for every code shown
   plus a `qr-codes.csv` listing team, scan code and link.
4. **Print** for cut-out cards.

Each team can also download only its own code at
`https://depbbqfanfavorite.com/qr/{scan_code}` (add `?view=1` to open it in
the browser instead). That's the link sent in the Fan Favorite team emails.

To re-point one code, set `qr_target` on that team's row in the Supabase
Table Editor. Clear it to go back to the vote page.

## 7. Before event day

- Do a full dry run: scan a real printed QR code with a phone, vote, and
  confirm it shows up on `/leaderboard`.
- Project `/leaderboard` on a screen if you want a live results display.
- Double-check `NEXT_PUBLIC_ADMIN_PASSCODE` isn't left as the default.
