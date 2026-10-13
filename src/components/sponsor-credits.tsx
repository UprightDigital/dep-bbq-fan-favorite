import SponsorBadge from "@/components/sponsor-badge";

// Both category sponsors, each under its category name.
export default function SponsorCredits({ fan = true }: { fan?: boolean }) {
  const rows = [
    ...(fan ? [{ label: "Fan Favorite", key: "fan" as const }] : []),
    { label: "Best Team Tent Experience", key: "tent" as const },
  ];
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 justify-center">
      {rows.map((r) => (
        <div key={r.key} className="flex flex-col items-center gap-2">
          <p className="text-bbq-gold/80 text-[11px] uppercase tracking-[0.2em]">
            {r.label}
          </p>
          <SponsorBadge category={r.key} size="sm" />
        </div>
      ))}
    </div>
  );
}
