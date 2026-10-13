import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import VoteButton from "./vote-button";

export const dynamic = "force-dynamic";

export default async function VotePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const id = Number(teamId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const { data: team, error } = await supabase
    .from("teams")
    .select("id, name, logo_url")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (error || !team) {
    notFound();
  }

  const { data: votingOpen } = await supabase.rpc("voting_is_open");

  return (
    <main className="flex-1 flex flex-col bg-brand-hero px-4 sm:px-8 py-6 sm:py-10">
      <div className="brand-frame flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <Image
          src="/brand/logo.png"
          alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
          width={220}
          height={141}
          priority
          className="w-[150px] sm:w-[190px] h-auto mb-10"
        />

        {team.logo_url ? (
          <div className="relative w-56 h-36 sm:w-72 sm:h-44 mb-8 bg-bbq-white rounded-sm p-3">
            <Image
              src={team.logo_url}
              alt={`${team.name} logo`}
              fill
              className="object-contain p-2"
              sizes="288px"
            />
          </div>
        ) : (
          <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl mb-8 max-w-2xl leading-tight">
            {team.name}
          </h1>
        )}

        {votingOpen ? (
          <>
            <p className="font-script text-2xl text-bbq-gray mb-10">
              You&rsquo;re voting for
            </p>
            <VoteButton teamId={team.id} teamName={team.name} />
          </>
        ) : (
          <>
            <p className="font-display text-bbq-gold text-3xl sm:text-5xl leading-tight mb-4">
              Voting will begin on 11/11
            </p>
            <p className="text-bbq-gray text-sm sm:text-base max-w-sm leading-relaxed">
              Come back to this booth on Wednesday, November 11 to rate{" "}
              {team.name} for Fan Favorite.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
