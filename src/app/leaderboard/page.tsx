"use client";

import { useEffect, useState } from "react";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { supabase, Team } from "@/lib/supabase";

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("teams")
        .select("id, name, votes")
        .order("votes", { ascending: false })
        .order("name", { ascending: true });
      if (active && data) setTeams(data as Team[]);
      setLoading(false);
    }
    load();

    const channel = supabase
      .channel("teams-leaderboard")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "teams" },
        (payload: RealtimePostgresUpdatePayload<Team>) => {
          setTeams((prev) => {
            const updated = prev.map((t) =>
              t.id === payload.new.id ? { ...t, votes: payload.new.votes } : t
            );
            return updated.sort((a, b) => b.votes - a.votes);
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const totalVotes = teams.reduce((sum, t) => sum + t.votes, 0);
  const [first, second, third, ...rest] = teams;

  return (
    <main className="flex-1 px-4 sm:px-8 py-10 max-w-3xl mx-auto w-full">
      <header className="text-center mb-10">
        <p className="font-script text-xl text-bbq-gray">Live results</p>
        <h1 className="font-display text-bbq-gold text-3xl sm:text-5xl">
          Fan Favorite Leaderboard
        </h1>
        <p className="text-bbq-gray text-sm mt-2">
          {totalVotes} vote{totalVotes === 1 ? "" : "s"} cast so far
        </p>
      </header>

      {loading ? (
        <p className="text-center text-bbq-gray">Loading results…</p>
      ) : teams.length === 0 ? (
        <p className="text-center text-bbq-gray">
          No teams found yet. Have you run the Supabase migration?
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 items-end">
            <Podium place={2} team={second} />
            <Podium place={1} team={first} />
            <Podium place={3} team={third} />
          </div>

          <ol className="space-y-2">
            {rest.map((team, i) => (
              <li
                key={team.id}
                className="flex items-center justify-between bg-white/5 rounded-sm px-4 py-3"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="text-bbq-gray w-8 text-right shrink-0">
                    {i + 4}
                  </span>
                  <span className="truncate">{team.name}</span>
                </span>
                <span className="font-display text-bbq-gold text-lg shrink-0 pl-3">
                  {team.votes}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}

function Podium({ place, team }: { place: 1 | 2 | 3; team?: Team }) {
  const heights: Record<1 | 2 | 3, string> = {
    1: "h-40",
    2: "h-28",
    3: "h-20",
  };
  const colors: Record<1 | 2 | 3, string> = {
    1: "bg-bbq-gold text-bbq-black",
    2: "bg-bbq-gray text-bbq-black",
    3: "bg-bbq-bronze text-bbq-black",
  };

  if (!team) return <div />;

  return (
    <div className="flex flex-col items-center text-center min-w-0">
      <p className="text-xs sm:text-sm text-bbq-gray mb-1 truncate max-w-full px-1">
        {team.name}
      </p>
      <p className="font-display text-xl sm:text-2xl text-bbq-gold mb-2">
        {team.votes}
      </p>
      <div
        className={`w-full ${heights[place]} ${colors[place]} rounded-t-sm flex items-start justify-center pt-2 font-display text-2xl`}
      >
        {place}
      </div>
    </div>
  );
}
