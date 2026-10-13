import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col bg-brand-hero px-4 sm:px-8 py-6 sm:py-10">
      <div className="brand-frame flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <Image
          src="/brand/logo.png"
          alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
          width={220}
          height={141}
          priority
          className="w-[150px] sm:w-[190px] h-auto mb-10"
        />
        <p className="font-display text-bbq-gold text-3xl sm:text-4xl leading-tight mb-4">
          We couldn&rsquo;t find that booth
        </p>
        <p className="text-bbq-gray text-sm sm:text-base max-w-sm leading-relaxed mb-8">
          Try scanning the QR code at the booth again, or browse every team on
          the leaderboard.
        </p>
        <Link
          href="/leaderboard"
          className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
        >
          View Leaderboard
        </Link>
      </div>
    </main>
  );
}
