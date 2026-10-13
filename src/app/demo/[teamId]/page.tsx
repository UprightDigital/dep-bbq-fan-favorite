import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RatingForm from "../../vote/[teamId]/rating-form";
import {
  CATEGORY,
  CategoryHeading,
  Star,
  TeamLogo,
  TryAgain,
  VoteShell,
  loadTeam,
} from "../../vote/[teamId]/shared";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Preview of the attendee voting flow that works while voting is locked.
// Uses the real screens but never records a vote.
function clamp(v?: string) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

function PreviewBanner() {
  return (
    <div className="mb-6 border border-bbq-gold/50 rounded-full px-4 py-1.5 text-bbq-gold text-[11px] uppercase tracking-[0.2em]">
      Preview &middot; votes are not counted
    </div>
  );
}

function Stars({ label, rating }: { label: string; rating: number }) {
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

export default async function DemoPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ step?: string; ff?: string; tent?: string }>;
}) {
  const { teamId } = await params;
  const sp = await searchParams;
  const id = Number(teamId);
  if (!Number.isInteger(id)) notFound();

  const { team, error } = await loadTeam(id);
  if (error) return <TryAgain href={`/demo/${id}`} />;
  if (!team) notFound();

  const isCook = team.kind === "Cooking";
  const base = `/demo/${team.id}`;
  const fan = clamp(sp.ff);
  const tent = clamp(sp.tent);

  if (sp.step === "done") {
    return (
      <VoteShell>
        <PreviewBanner />
        <TeamLogo team={team} />
        {(fan || tent) && (
          <div className="flex flex-col gap-5 mb-8">
            {fan && <Stars label={CATEGORY.fan} rating={fan} />}
            {tent && <Stars label={CATEGORY.tent} rating={tent} />}
          </div>
        )}
        <p className="font-script text-2xl text-bbq-gray mb-6">
          {fan && tent ? "Your votes are in" : "Your vote is in"}
        </p>
        <p className="text-bbq-gray text-sm sm:text-base mb-10 max-w-sm">
          Thanks for voting! Find another booth and scan their QR code to keep
          rating.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/leaderboard"
            className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
          >
            View Live Leaderboard
          </Link>
          <Link
            href={base}
            className="text-bbq-gray/70 text-sm underline underline-offset-4 hover:text-bbq-gold"
          >
            Start the preview over
          </Link>
        </div>
      </VoteShell>
    );
  }

  const done = (extra: string) =>
    `${base}?step=done${fan ? `&ff=${fan}` : ""}${extra}`;

  if ((sp.step === "tent" && fan) || !isCook) {
    return (
      <VoteShell>
        <PreviewBanner />
        <TeamLogo team={team} />
        <CategoryHeading
          step={isCook ? "Step 2 of 2" : undefined}
          title={CATEGORY.tent}
        />
        <RatingForm
          key="tent"
          demo
          teamId={team.id}
          teamName={team.name}
          rpc="add_tent_rating"
          sponsor="tent"
          nextPath={done("&tent={rating}")}
          skipHref={isCook && fan ? done("") : undefined}
        />
      </VoteShell>
    );
  }

  return (
    <VoteShell>
      <PreviewBanner />
      <TeamLogo team={team} />
      <CategoryHeading step="Step 1 of 2" title={CATEGORY.fan} />
      <RatingForm
        key="fan"
        demo
        teamId={team.id}
        teamName={team.name}
        rpc="add_team_rating"
        sponsor="fan"
        nextPath={`${base}?step=tent&ff={rating}`}
      />
    </VoteShell>
  );
}
