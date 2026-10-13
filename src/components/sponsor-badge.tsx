import Image from "next/image";
import { SPONSORS, type SponsorKey } from "@/lib/sponsors";

// "Sponsored by [logo]" credit for a vote category. Logos sit on a light
// plate because both sponsor marks are dark and vanish on the black theme.
export default function SponsorBadge({
  category,
  size = "md",
}: {
  category: SponsorKey;
  size?: "sm" | "md" | "lg";
}) {
  const s = SPONSORS[category];
  const box = {
    sm: "w-[96px] h-[40px]",
    md: "w-[120px] h-[50px]",
    lg: "w-[120px] h-[50px] lg:w-[170px] lg:h-[70px]",
  }[size];
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-bbq-gray/70 text-[10px] sm:text-xs uppercase tracking-[0.25em]">
        Sponsored by
      </span>
      <span className="bg-white rounded-md px-3 py-1.5 shadow-sm">
        <span className={`relative block ${box}`}>
          <Image src={s.logo} alt={s.name} fill className="object-contain" sizes="170px" />
        </span>
      </span>
    </div>
  );
}
