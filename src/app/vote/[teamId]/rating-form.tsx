"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Star } from "./shared";

type Status = "idle" | "voting" | "error" | "closed";

export default function RatingForm({
  teamId,
  teamName,
  rpc,
  nextPath,
  skipHref,
  demo = false,
}: {
  teamId: number;
  teamName: string;
  rpc: "add_team_rating" | "add_tent_rating";
  // Where to go after a successful rating; "{rating}" is replaced.
  nextPath: string;
  skipHref?: string;
  // Preview mode: walks through the screens without recording a vote.
  demo?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  async function handleConfirm() {
    if (!selected || status === "voting") return;
    setStatus("voting");
    if (demo) {
      router.push(nextPath.replace("{rating}", String(selected)));
      return;
    }
    // Not retried: a vote that reached the server but lost its reply would
    // otherwise be counted twice.
    const { error } = await supabase.rpc(rpc, {
      p_team_id: teamId,
      p_rating: selected,
    });
    if (error) {
      console.error(error);
      setStatus(/voting is closed/i.test(error.message) ? "closed" : "error");
      return;
    }
    router.push(nextPath.replace("{rating}", String(selected)));
  }

  const display = hovered ?? selected ?? 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-bbq-gray text-sm sm:text-base">
        Tap a star to rate {teamName}
      </p>
      <div
        className="flex gap-2 sm:gap-3"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={status === "voting"}
            onMouseEnter={() => setHovered(n)}
            onFocus={() => setHovered(n)}
            onClick={() => setSelected(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            aria-pressed={selected === n}
            className="w-11 h-11 sm:w-14 sm:h-14 text-bbq-gray hover:scale-110 transition-transform disabled:opacity-60"
            style={{ color: n <= display ? "var(--bbq-gold)" : undefined }}
          >
            <Star filled={n <= display} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selected || status === "voting"}
        className="bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "voting"
          ? "Submitting…"
          : selected
            ? `Confirm ${selected} Star${selected === 1 ? "" : "s"}`
            : "Select a rating"}
      </button>

      {skipHref && status !== "voting" && (
        <Link
          href={skipHref}
          className="text-bbq-gray/70 text-sm underline underline-offset-4 hover:text-bbq-gold"
        >
          Skip this one
        </Link>
      )}

      {status === "closed" && (
        <p className="text-bbq-gold text-sm sm:text-base max-w-xs">
          Voting is closed. Voting runs Wed 11/11, 12:30&ndash;7:30 PM.
        </p>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm max-w-xs">
          Something went wrong. Check your connection and try again.
        </p>
      )}
    </div>
  );
}
