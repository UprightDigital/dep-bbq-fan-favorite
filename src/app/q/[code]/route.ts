import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// Dynamic QR code resolver.
//
// Every printed QR code points at /q/{scan_code}. The scan code is locked in
// the database and never changes, so the printed code is permanent. Where it
// sends people is decided here, at scan time:
//   - teams.qr_target (optional override): a site path like "/leaderboard"
//     or a full https:// URL
//   - otherwise: that team's vote page, /vote/{id}
// Changing a team's name, logo, id or destination never requires a reprint.

export const dynamic = "force-dynamic";

function redirect(to: URL) {
  // 307 + no-store so phones never cache where a code points.
  const res = NextResponse.redirect(to, 307);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

function resolveTarget(
  qrTarget: string | null,
  teamId: number,
  base: string
): URL {
  const target = qrTarget?.trim();
  if (target) {
    if (/^https:\/\//i.test(target)) {
      try {
        return new URL(target);
      } catch {
        // fall through to the default
      }
    } else if (target.startsWith("/") && !target.startsWith("//")) {
      return new URL(target, base);
    }
  }
  return new URL(`/vote/${teamId}`, base);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const scanCode = decodeURIComponent(code).trim().toUpperCase();

  const { data: team, error } = await supabase
    .from("teams")
    .select("id, qr_target")
    .eq("scan_code", scanCode)
    .maybeSingle();

  if (error || !team) {
    if (error) console.error("QR lookup failed", scanCode, error);
    return redirect(new URL("/", request.url));
  }

  return redirect(resolveTarget(team.qr_target, team.id, request.url));
}
