import { notFound, redirect } from "next/navigation";
import RatingForm from "../rating-form";
import {
  CATEGORY,
  CategoryHeading,
  TeamLogo,
  TryAgain,
  VoteShell,
  loadTeam,
} from "../shared";

export const dynamic = "force-dynamic";

function clampRating(value?: string) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

// Step 2 for cook teams: Best Team Tent Experience.
export default async function TentPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ ff?: string }>;
}) {
  const { teamId } = await params;
  const { ff } = await searchParams;
  const id = Number(teamId);
  if (!Number.isInteger(id)) notFound();

  const { team, votingOpen, error } = await loadTeam(id);
  if (error) return <TryAgain href={`/vote/${id}/tent${ff ? `?ff=${ff}` : ""}`} />;
  if (!team) notFound();
  if (!votingOpen) redirect(`/vote/${id}`);

  const fan = clampRating(ff);
  // Cook teams must submit Fan Favorite before the tent vote.
  if (team.kind === "Cooking" && !fan) redirect(`/vote/${id}`);
  const done = fan
    ? `/vote/${team.id}/confirmed?ff=${fan}`
    : `/vote/${team.id}/confirmed`;

  return (
    <VoteShell>
      <TeamLogo team={team} />
      <CategoryHeading
        step={team.kind === "Cooking" ? "Step 2 of 2" : undefined}
        title={CATEGORY.tent}
        sponsor="tent"
      />
      <RatingForm
        teamId={team.id}
        teamName={team.name}
        rpc="add_tent_rating"
        nextPath={`${done}${fan ? "&" : "?"}tent={rating}`}
        skipHref={fan ? done : undefined}
      />
    </VoteShell>
  );
}
