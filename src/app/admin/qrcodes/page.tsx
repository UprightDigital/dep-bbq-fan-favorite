"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { supabase, Team } from "@/lib/supabase";

export default function QRCodesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [qrs, setQrs] = useState<Record<number, string>>({});
  const [origin, setOrigin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of window.location on mount
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("teams")
        .select("id, name, votes, logo_url")
        .order("id", { ascending: true });
      if (data) setTeams(data as Team[]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!origin || teams.length === 0) return;
    let cancelled = false;

    async function generate() {
      const entries = await Promise.all(
        teams.map(async (team) => {
          const url = `${origin}/vote/${team.id}`;
          const dataUrl = await QRCode.toDataURL(url, {
            margin: 1,
            width: 300,
            color: { dark: "#000000", light: "#ffffff" },
          });
          return [team.id, dataUrl] as const;
        })
      );
      if (!cancelled) setQrs(Object.fromEntries(entries));
    }
    generate();

    return () => {
      cancelled = true;
    };
  }, [origin, teams]);

  return (
    <main className="flex-1 px-4 sm:px-8 py-10 max-w-6xl mx-auto w-full">
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="font-script text-xl text-bbq-gray">
            Organizer console
          </p>
          <h1 className="font-display text-bbq-gold text-3xl sm:text-4xl">
            Booth QR Codes
          </h1>
          <p className="text-bbq-gray text-sm mt-1 max-w-xl">
            {teams.length} teams &middot; each QR links to{" "}
            <code className="text-bbq-white">
              {origin || "…"}/vote/&#123;teamId&#125;
            </code>
            . Print this page (or export to PDF) and cut out one card per
            booth.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-bbq-bronze transition-colors shrink-0"
        >
          Print all {teams.length} cards
        </button>
      </div>

      {loading ? (
        <p className="text-center text-bbq-gray">Loading teams…</p>
      ) : teams.length === 0 ? (
        <p className="text-center text-bbq-gray">
          No teams found. Run the Supabase migration to seed placeholder
          teams first.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 print:grid-cols-2 gap-4 print:gap-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white text-black rounded-sm p-4 flex flex-col items-center text-center break-inside-avoid border border-neutral-200 print:border-neutral-400"
            >
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                Team {team.id}
              </p>
              {team.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={team.logo_url}
                  alt=""
                  className="h-10 max-w-[160px] object-contain mb-2"
                />
              )}
              <p className="font-semibold text-lg mb-3 leading-tight">
                {team.name}
              </p>
              {qrs[team.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrs[team.id]}
                  alt={`QR code to vote for ${team.name}`}
                  className="w-32 h-32 sm:w-36 sm:h-36"
                />
              ) : (
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-neutral-100 animate-pulse" />
              )}
              <p className="text-xs text-neutral-500 mt-3">
                Scan to vote &bull; Fan Favorite
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
