"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "idle" | "voting" | "voted" | "error";

export default function VoteButton({
  teamId,
  teamName,
}: {
  teamId: number;
  teamName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleVote() {
    setStatus("voting");
    const { error } = await supabase.rpc("increment_team_vote", {
      p_team_id: teamId,
    });
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setStatus("voted");
  }

  if (status === "voted") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl" aria-hidden>
          🏆
        </div>
        <p className="text-xl">
          Thanks for voting for{" "}
          <span className="text-bbq-gold font-semibold">{teamName}</span>!
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-bbq-gray text-sm underline underline-offset-4 hover:text-bbq-gold transition-colors"
        >
          Vote again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleVote}
        disabled={status === "voting"}
        className="bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-xl px-10 py-5 rounded-sm hover:bg-bbq-bronze transition-colors disabled:opacity-60"
      >
        {status === "voting" ? "Casting your vote…" : `Vote for ${teamName}`}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm max-w-xs">
          Something went wrong &mdash; check your connection and try again.
        </p>
      )}
    </div>
  );
}
