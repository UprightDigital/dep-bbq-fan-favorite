"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "voting" | "voted" | "error";

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
  const [status, setStatus] = useState<Status>("idle");
  const [hovered, setHovered] = useState<number | null>(null);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  async function handleRate(rating: number) {
    setStatus("voting");
    const { error } = await supabase.rpc("add_team_rating", {
      p_team_id: teamId,
      p_rating: rating,
    });
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setSubmittedRating(rating);
    setStatus("voted");
  }

  if (status === "voted" && submittedRating) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1 w-40 text-bbq-gold">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="w-8 h-8">
              <Star filled={n <= submittedRating} />
            </span>
          ))}
        </div>
        <p className="text-xl">
          Thanks for rating{" "}
          <span className="text-bbq-gold font-semibold">{teamName}</span>{" "}
          {submittedRating} star{submittedRating === 1 ? "" : "s"}!
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setSubmittedRating(null);
          }}
          className="text-bbq-gray text-sm underline underline-offset-4 hover:text-bbq-gold transition-colors"
        >
          Rate again
        </button>
      </div>
    );
  }

  const active = hovered ?? 0;

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
            onClick={() => handleRate(n)}
            aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
            className="w-11 h-11 sm:w-14 sm:h-14 text-bbq-gray hover:scale-110 transition-transform disabled:opacity-60"
            style={{ color: n <= active ? "var(--bbq-gold)" : undefined }}
          >
            <Star filled={n <= active} />
          </button>
        ))}
      </div>
      {status === "voting" && (
        <p className="text-bbq-gray text-sm">Submitting your rating&hellip;</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm max-w-xs">
          Something went wrong &mdash; check your connection and try again.
        </p>
      )}
    </div>
  );
}
