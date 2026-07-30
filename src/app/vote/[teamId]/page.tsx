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
    .single();

  if (error || !team) {
    notFound();
  }

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

        {team.logo_url && (
          <div className="relative w-44 h-28 sm:w-56 sm:h-32 mb-8 bg-bbq-white rounded-sm p-3">
            <Image
              src={team.logo_url}
              alt={`${team.name} logo`}
              fill
              className="object-contain p-2"
              sizes="220px"
            />
          </div>
        )}

        <p className="font-script text-2xl text-bbq-gray mb-2">
          You&rsquo;re voting for
        </p>
        <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl mb-10 max-w-2xl leading-tight">
          {team.name}
        </h1>
        <VoteButton teamId={team.id} teamName={team.name} />
      </div>
    </main>
  );
}
