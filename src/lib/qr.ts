// Shared settings for every QR code image the site produces (admin print
// page and the per-team /qr/{scan_code} download), so they always match.
export const QR_OPTIONS = {
  margin: 2,
  width: 1000,
  // "Q" survives scuffs, glare and small logos on printed signage.
  errorCorrectionLevel: "Q" as const,
  color: { dark: "#000000", light: "#ffffff" },
};

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
