# DEP BBQ Fan Favorite Voting

A QR-code voting platform for the Daniel Energy Partners Permian Basin BBQ
Cook-Off's Fan Favorite award. Each of the 110 cook teams gets its own QR
code at their booth; fans scan it, tap a button, and their vote is added to
that team's live-updating leaderboard.

**Stack:** Next.js (deployed on Vercel) + Supabase (Postgres + Realtime for
the live leaderboard). No login, no app install &mdash; a fan just scans and taps.

## How it works

- Every team has a row in a `teams` table (`id`, `name`, `votes`).
- Each booth's QR code points to `https://your-domain.com/vote/{teamId}`.
- Tapping "Vote" calls a Postgres function, `increment_team_vote`, which adds
  exactly 1 to that team's count. Fans' browsers only have the public
  ("anon") key, and that key is not allowed to write to the `teams` table
  directly &mdash; only to call this function &mdash; so nobody can fake a vote
  count via the API.
- As you asked, there's **no per-device vote limit**: every scan + tap counts.
  If you want to add a limit later (e.g. one vote per team per device), that
  would go in `vote-button.tsx` using a cookie/localStorage check.
- `/leaderboard` subscribes to Supabase Realtime, so it updates live as votes
  come in &mdash; good for projecting on a screen at the event.
- `/admin/qrcodes` generates and prints all 110 QR codes, using whatever
  domain the app is actually deployed on (no need to know the URL in advance).

## 1. Create the Supabase project

1. In your Supabase account, create a new project for this event (separate
   from your other project).
2. Open the **SQL Editor** and run the contents of
   `supabase/migrations/001_init.sql`. This creates the `teams` table, the
   `vote_log` audit table, the security policies, the `increment_team_vote`
   function, turns on Realtime for `teams`, and seeds 110 placeholder rows
   (`Team 1` &hellip; `Team 110`).
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
