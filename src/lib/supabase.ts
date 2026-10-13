import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Add them to .env.local (see .env.local.example)."
  );
}

// A single shared Supabase client using the public anon key.
// Safe to use in the browser: RLS policies + the add_team_rating()
// function are what actually protect the data (see supabase/migrations).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Team = {
  id: number;
  name: string;
  votes: number;
  tent_votes?: number;
  logo_url: string | null;
  booth_number?: string | null;
  kind?: string;
};

// The permanent public address printed on every QR code. This is fixed on
// purpose: QR codes must never depend on whichever URL the admin page happens
// to be opened from (preview deployments are login-protected).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://dep-bbq-fan-favorite.vercel.app"
).replace(/\/+$/, "");

// What a printed QR code encodes. It only contains the team's locked
// scan_code; /q/{scan_code} decides where to send people at scan time.
export function qrUrl(scanCode: string) {
  return `${SITE_URL}/q/${scanCode}`;
}

// Retry a Supabase call a few times before giving up, so a brief network
// blip between the site and the database doesn't show attendees an error.
export async function withRetry<T extends { error: unknown }>(
  run: () => PromiseLike<T>,
  attempts = 3
): Promise<T> {
  let result = await run();
  for (let i = 1; i < attempts && result.error; i++) {
    await new Promise((r) => setTimeout(r, 150 * i));
    result = await run();
  }
  return result;
}

// End of the Fan Favorite voting window (Wed Nov 11, 2026, 7:30 PM Central).
// Must match voting_is_open() in the database.
export const VOTING_CLOSES_AT = Date.parse("2026-11-12T01:30:00Z");
export const votingHasEnded = () => Date.now() >= VOTING_CLOSES_AT;
