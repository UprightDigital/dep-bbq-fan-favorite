import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { supabase, withRetry, qrUrl } from "@/lib/supabase";
import { QR_OPTIONS, slugify } from "@/lib/qr";

// Per-team QR code download: /qr/{scan_code}
//
// Emailed to each team so they can download only their own Fan Favorite QR
// code. The scan_code is an unguessable, locked code, so a team's link only
// ever returns that team's image. The PNG is identical to the one on
// /admin/qrcodes (same encoded URL, size and error correction).
// Add ?view=1 to show the image in the browser instead of downloading it.

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const scanCode = decodeURIComponent(code)
    .trim()
    .toUpperCase()
    .replace(/\.PNG$/, "");

  const { data: team, error } = await withRetry(() =>
    supabase
      .from("teams")
      .select("name, scan_code, active")
      .eq("scan_code", scanCode)
      .maybeSingle()
  );

  if (error || !team || !team.active) {
    if (error) console.error("QR download lookup failed", scanCode, error);
    return new NextResponse("QR code not found.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const png = await QRCode.toBuffer(qrUrl(team.scan_code), {
    ...QR_OPTIONS,
    type: "png",
  });

  const fileName = `${slugify(team.name)}-fan-favorite-qr-code.png`;
  const inline = request.nextUrl.searchParams.has("view");

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${fileName}"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
