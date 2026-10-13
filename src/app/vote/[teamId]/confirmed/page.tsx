import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, withRetry } from "@/lib/supabase";
import { CATEGORY, Star, TeamLogo, VoteShell, type VoteTeam } from "../shared";

export const dynamic = "force-dynamic";

function clampRating(value?: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function RatingRow({ label, rating }: { label: string; rating: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-bbq-gray text-xs uppercase tracking-[0.2em]">
        {label}
      </p>
      <div className="flex gap-1 w-40 sm:w-48 text-bbq-gold">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="w-full">
            <Star filled={n <= rating} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function VoteConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ ff?: string; tent?: string; rating?: string }>;
}) {
  const { teamId } = await params;
  const sp = await searchParams;
  const id = Number(teamId);
  // `rating` is the old single-vote parameter; treat it as Fan Favorite.
  const fan = clampRating(sp.ff ?? sp.rating);
  const tent = clampRating(sp.tent);

  if (!Number.isInteger(id)) notFound();

  const { data: team } = await withRetry(() =>
    supabase
      .from("teams")
      .select("id, name, logo_url, kind")
      .eq("id", id)
      .eq("active", true)
      .maybeSingle()
  );
  if (!team) notFound();

  return (
    <VoteShell>
      <TeamLogo team={team as VoteTeam} />

      {(fan || tent) && (
        <div className="flex flex-col gap-5 mb-8">
          {fan && <RatingRow label={CATEGORY.fan} rating={fan} />}
          {tent && <RatingRow label={CATEGORY.tent} rating={tent} />}
        </div>
      )}

      <p className="font-script text-2xl text-bbq-gray mb-6">
        {fan && tent ? "Your votes are in" : "Your vote is in"}
      </p>
      <p className="text-bbq-gray text-sm sm:text-base mb-10 max-w-sm">
        Thanks for voting! Find another booth and scan their QR code to keep
        rating.
      </p>

      <Link
        href="/leaderboard"
        className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
      >
        View Live Leaderboard
      </Link>
    </VoteShell>
  );
}
