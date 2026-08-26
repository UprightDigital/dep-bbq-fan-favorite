import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.9l-5.2 2.73.99-5.8-4.21-4.1 5.82-.85L12 3.5z"
      />
    </svg>
  );
}

export default async function VoteConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ rating?: string }>;
}) {
  const { teamId } = await params;
  const { rating: ratingParam } = await searchParams;
  const id = Number(teamId);
  const rating = Math.min(5, Math.max(1, Number(ratingParam) || 0));

  if (!Number.isInteger(id) || !rating) {
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

        <div className="flex gap-1 w-44 sm:w-52 text-bbq-gold mb-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="w-full">
              <Star filled={n <= rating} />
            </span>
          ))}
        </div>

        <p className="font-script text-2xl text-bbq-gray mb-2">
          Your vote is in for
        </p>
        <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl mb-8 max-w-2xl leading-tight">
          {team.name}
        </h1>
        <p className="text-bbq-gray text-sm sm:text-base mb-10 max-w-sm">
          Thanks for helping pick this year&rsquo;s Fan Favorite. Your rating
          has been counted.
        </p>

        <Link
          href="/leaderboard"
          className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
        >
          View Live Leaderboard
        </Link>
      </div>
    </main>
  );
}
