"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { supabase, qrUrl, SITE_URL } from "@/lib/supabase";

type QrTeam = {
  id: number;
  name: string;
  logo_url: string | null;
  scan_code: string;
  kind: string;
};

type Filter = "all" | "Cooking" | "Hospitality";

const QR_OPTIONS = {
  margin: 2,
  width: 1000,
  // "Q" survives scuffs, glare and small logos on printed signage.
  errorCorrectionLevel: "Q" as const,
  color: { dark: "#000000", light: "#ffffff" },
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function fileName(team: QrTeam) {
  return `${team.id}-${slugify(team.name)}-${team.scan_code}.png`;
}

function csvCell(v: string | number) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function QRCodesPage() {
  const [teams, setTeams] = useState<QrTeam[]>([]);
  const [qrs, setQrs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [zipping, setZipping] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("teams")
        .select("id, name, logo_url, scan_code, kind")
        .eq("active", true)
        .order("id", { ascending: true });
      if (data) setTeams(data as QrTeam[]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (teams.length === 0) return;
    let cancelled = false;

    async function generate() {
      const entries = await Promise.all(
        teams.map(async (team) => {
          const dataUrl = await QRCode.toDataURL(
            qrUrl(team.scan_code),
            QR_OPTIONS
          );
          return [team.id, dataUrl] as const;
        })
      );
      if (!cancelled) setQrs(Object.fromEntries(entries));
    }
    generate();

    return () => {
      cancelled = true;
    };
  }, [teams]);

  const shown = useMemo(
    () => (filter === "all" ? teams : teams.filter((t) => t.kind === filter)),
    [teams, filter]
  );

  const counts = useMemo(
    () => ({
      all: teams.length,
      Cooking: teams.filter((t) => t.kind === "Cooking").length,
      Hospitality: teams.filter((t) => t.kind === "Hospitality").length,
    }),
    [teams]
  );

  const ready = shown.length > 0 && shown.every((t) => qrs[t.id]);

  async function downloadOne(team: QrTeam) {
    const dataUrl = qrs[team.id];
    if (!dataUrl) return;
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, fileName(team));
  }

  async function downloadAll() {
    if (!ready || zipping) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const rows = [["Team ID", "Team", "Type", "Scan Code", "QR Link", "File"]];
      for (const team of shown) {
        const base64 = qrs[team.id].split(",")[1];
        const name = fileName(team);
        zip.file(name, base64, { base64: true });
        rows.push([
          String(team.id),
          team.name,
          team.kind,
          team.scan_code,
          qrUrl(team.scan_code),
          name,
        ]);
      }
      zip.file(
        "qr-codes.csv",
        rows.map((r) => r.map(csvCell).join(",")).join("\n")
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const label = filter === "all" ? "all" : filter.toLowerCase();
      downloadBlob(blob, `dep-bbq-fan-favorite-qr-codes-${label}.zip`);
    } finally {
      setZipping(false);
    }
  }

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "Cooking", label: "Cook teams" },
    { key: "Hospitality", label: "Hospitality" },
  ];

  return (
    <main className="flex-1 px-4 sm:px-8 py-10 max-w-6xl mx-auto w-full">
      <div className="no-print flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-script text-xl text-bbq-gray">
              Organizer console
            </p>
            <h1 className="font-display text-bbq-gold text-3xl sm:text-4xl">
              Booth QR Codes
            </h1>
            <p className="text-bbq-gray text-sm mt-2 max-w-xl leading-relaxed">
              These codes are permanent. Each one links to{" "}
              <code className="text-bbq-white">
                {SITE_URL.replace(/^https:\/\//, "")}/q/&#123;scan code&#125;
              </code>{" "}
              and the site decides where to send people when it&rsquo;s
              scanned, so team names, logos and destinations can change
              without reprinting.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={downloadAll}
              disabled={!ready || zipping}
              className="bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider px-5 py-3 rounded-sm hover:bg-bbq-bronze transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {zipping ? "Zipping…" : `Download ${shown.length} (ZIP)`}
            </button>
            <button
              onClick={() => window.print()}
              className="border border-bbq-gold text-bbq-gold font-semibold uppercase tracking-wider px-5 py-3 rounded-sm hover:bg-bbq-gold hover:text-bbq-black transition-colors"
            >
              Print
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              aria-pressed={filter === t.key}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                filter === t.key
                  ? "bg-bbq-gold text-bbq-black border-bbq-gold"
                  : "border-white/20 text-bbq-gray hover:border-bbq-gold hover:text-bbq-gold"
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-bbq-gray">Loading teams…</p>
      ) : shown.length === 0 ? (
        <p className="text-center text-bbq-gray">No teams found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 print:grid-cols-2 gap-4 print:gap-2">
          {shown.map((team) => (
            <div
              key={team.id}
              className="bg-white text-black rounded-sm p-4 flex flex-col items-center text-center break-inside-avoid border border-neutral-200 print:border-neutral-400"
            >
              <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
                Team {team.id} &middot; {team.kind}
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
                  alt={`QR code for ${team.name}`}
                  className="w-32 h-32 sm:w-36 sm:h-36"
                />
              ) : (
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-neutral-100 animate-pulse" />
              )}
              <p className="text-xs text-neutral-500 mt-3">
                Scan to rate &bull; Fan Favorite
              </p>
              <p className="text-[11px] font-mono text-neutral-400 mt-1">
                {team.scan_code}
              </p>
              <button
                onClick={() => downloadOne(team)}
                disabled={!qrs[team.id]}
                className="no-print mt-3 text-xs uppercase tracking-wider text-neutral-600 border border-neutral-300 rounded-sm px-3 py-1.5 hover:border-neutral-600 hover:text-black disabled:opacity-40"
              >
                Download PNG
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
