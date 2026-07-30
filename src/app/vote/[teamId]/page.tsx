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
    .select("id, name")
    .eq("id", id)
    .single();

  if (error || !team) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-brand-hero px-6 py-16 text-center">
      <Image
        src="/brand/logo.png"
        alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
        width={220}
        height={141}
        priority
        className="w-[150px] sm:w-[190px] h-auto mb-10"
      />
      <p className="font-script text-2xl text-bbq-gray mb-2">
        You&rsquo;re voting for
      </p>
      <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl mb-10 max-w-2xl leading-tight">
        {team.name}
      </h1>
      <VoteButton teamId={team.id} teamName={team.name} />
    </main>
  );
}
