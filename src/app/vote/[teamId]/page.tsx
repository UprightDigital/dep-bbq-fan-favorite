import Link from "next/link";
import { notFound } from "next/navigation";
import { votingHasEnded } from "@/lib/supabase";
import RatingForm from "./rating-form";
import SponsorCredits from "@/components/sponsor-credits";
import {
  CATEGORY,
  CategoryHeading,
  TeamLogo,
  TryAgain,
  VoteShell,
  loadTeam,
} from "./shared";

export const dynamic = "force-dynamic";

// Step 1 of the booth vote.
//   Cook teams:        Fan Favorite  ->  Best Team Tent Experience  ->  thanks
//   Hospitality tents: Best Team Tent Experience  ->  thanks
export default async function VotePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const id = Number(teamId);
  if (!Number.isInteger(id)) notFound();

  const { team, votingOpen, error } = await loadTeam(id);
  if (error) return <TryAgain href={`/vote/${id}`} />;
  if (!team) notFound();

  const isCookTeam = team.kind === "Cooking";

  if (!votingOpen) {
    return (
      <VoteShell>
        <TeamLogo team={team} />
        {votingHasEnded() ? (
          <>
            <p className="font-display text-bbq-gold text-3xl sm:text-5xl leading-tight mb-4">
              Voting has closed
            </p>
            <p className="text-bbq-gray text-sm sm:text-base max-w-sm leading-relaxed mb-8">
              Thanks for supporting {team.name}. See how the race finished.
            </p>
            <Link
              href="/leaderboard"
              className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
            >
              View Results
            </Link>
          </>
        ) : (
          <>
            <p className="font-display text-bbq-gold text-3xl sm:text-5xl leading-tight mb-4">
              Voting will begin on 11/11
            </p>
            <p className="text-bbq-gray text-sm sm:text-base max-w-sm leading-relaxed">
              Come back to this booth on Wednesday, November 11 to rate{" "}
              {team.name} for{" "}
              {isCookTeam
                ? `${CATEGORY.fan} and ${CATEGORY.tent}`
                : CATEGORY.tent}
              .
            </p>
            <div className="mt-10">
              <SponsorCredits fan={isCookTeam} />
            </div>
          </>
        )}
      </VoteShell>
    );
  }

  return (
    <VoteShell>
      <TeamLogo team={team} />
      {isCookTeam ? (
        <>
          <CategoryHeading step="Step 1 of 2" title={CATEGORY.fan} sponsor="fan" />
          <RatingForm
            teamId={team.id}
            teamName={team.name}
            rpc="add_team_rating"
            nextPath={`/vote/${team.id}/tent?ff={rating}`}
          />
        </>
      ) : (
        <>
          <CategoryHeading title={CATEGORY.tent} sponsor="tent" />
          <RatingForm
            teamId={team.id}
            teamName={team.name}
            rpc="add_tent_rating"
            nextPath={`/vote/${team.id}/confirmed?tent={rating}`}
          />
        </>
      )}
    </VoteShell>
  );
}
