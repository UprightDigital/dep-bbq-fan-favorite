import Image from "next/image";
import Link from "next/link";
import { supabase, withRetry } from "@/lib/supabase";
import SponsorBadge from "@/components/sponsor-badge";
import type { SponsorKey } from "@/lib/sponsors";

export type VoteTeam = {
  id: number;
  name: string;
  logo_url: string | null;
  kind: string;
};

export const CATEGORY = {
  fan: "Fan Favorite",
  tent: "Best Team Tent Experience",
} as const;

// Loads the team and whether voting is open, retrying through brief
// network blips. `error` means the database couldn't be reached.
export async function loadTeam(id: number) {
  const [teamResult, votingResult] = await Promise.all([
    withRetry(() =>
      supabase
        .from("teams")
        .select("id, name, logo_url, kind")
        .eq("id", id)
        .eq("active", true)
        .maybeSingle()
    ),
    withRetry(() => supabase.rpc("voting_is_open")),
  ]);
  return {
    team: (teamResult.data as VoteTeam | null) ?? null,
    votingOpen: Boolean(votingResult.data),
    error: Boolean(teamResult.error || votingResult.error),
  };
}

export function Star({ filled }: { filled: boolean }) {
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

export function VoteShell({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </main>
  );
}

export function TeamLogo({ team }: { team: VoteTeam }) {
  return team.logo_url ? (
    <div className="relative w-56 h-36 sm:w-72 sm:h-44 mb-8 bg-bbq-white rounded-sm p-3">
      <Image
        src={team.logo_url}
        alt={`${team.name} logo`}
        fill
        priority
        className="object-contain p-2"
        sizes="288px"
      />
    </div>
  ) : (
    <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl mb-8 max-w-2xl leading-tight">
      {team.name}
    </h1>
  );
}

export function CategoryHeading({
  step,
  title,
  sponsor,
}: {
  step?: string;
  title: string;
  sponsor?: SponsorKey;
}) {
  return (
    <div className="mb-8">
      {step && (
        <p className="text-bbq-gray/70 text-xs uppercase tracking-[0.25em] mb-2">
          {step}
        </p>
      )}
      <p className="text-bbq-gold text-2xl sm:text-3xl leading-tight">{title}
      </p>
      {sponsor && (
        <div className="mt-3">
          <SponsorBadge category={sponsor} size="sm" />
        </div>
      )}
    </div>
  );
}

export function TryAgain({ href }: { href: string }) {
  return (
    <VoteShell>
      <p className="font-display text-bbq-gold text-3xl sm:text-4xl leading-tight mb-4">
        Hang tight
      </p>
      <p className="text-bbq-gray text-sm sm:text-base max-w-sm leading-relaxed mb-8">
        We couldn&rsquo;t load this booth just now. Tap below to try again.
      </p>
      <Link
        href={href}
        prefetch={false}
        className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
      >
        Try again
      </Link>
    </VoteShell>
  );
}
