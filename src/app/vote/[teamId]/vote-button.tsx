"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "voting" | "error";

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

export default function VoteButton({
  teamId,
  teamName,
}: {
  teamId: number;
  teamName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  async function handleConfirm() {
    if (!selected || status === "voting") return;
    setStatus("voting");
    const { error } = await supabase.rpc("add_team_rating", {
      p_team_id: teamId,
      p_rating: selected,
    });
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    router.push(`/vote/${teamId}/confirmed?rating=${selected}`);
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

      {status === "error" && (
        <p className="text-red-400 text-sm max-w-xs">
          Something went wrong &mdash; check your connection and try again.
        </p>
      )}
    </div>
  );
}
