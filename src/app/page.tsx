import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="bg-brand-hero flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <Image
          src="/brand/logo.png"
          alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
          width={420}
          height={269}
          priority
          className="w-[280px] sm:w-[380px] h-auto mb-8"
        />
        <h1 className="font-display text-bbq-gold text-4xl sm:text-6xl tracking-wide mb-3">
          Fan Favorite Voting
        </h1>
        <p className="font-script text-2xl sm:text-3xl text-bbq-white mb-10">
          November 10&ndash;11, 2026 &middot; Scharbauer Sports Complex, Midland, TX
        </p>
        <p className="max-w-xl text-bbq-gray text-base sm:text-lg mb-10 leading-relaxed">
          Find a cook team&rsquo;s booth, scan their QR code, and tap once to
          cast your vote for Fan Favorite. One scan, one tap &mdash; that&rsquo;s it.
        </p>
        <Link
          href="/leaderboard"
          className="inline-block bg-bbq-gold text-bbq-black font-condensed font-semibold uppercase tracking-wider text-lg px-8 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
        >
          View Live Leaderboard
        </Link>
      </section>

      <footer className="no-print border-t border-white/10 py-6 text-center">
        <Link
          href="/admin/qrcodes"
          className="text-bbq-gray/70 text-sm hover:text-bbq-gold transition-colors"
        >
          Organizer console: generate booth QR codes &rarr;
        </Link>
      </footer>
    </main>
  );
}
