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
// Safe to use in the browser: RLS policies + the increment_team_vote()
// function are what actually protect the data (see supabase/migrations).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Team = {
  id: number;
  name: string;
  votes: number;
  logo_url: string | null;
};
