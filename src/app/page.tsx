import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <section className="bg-brand-hero flex-1 flex flex-col px-6 sm:px-12 py-10">
        <div className="flex items-center justify-between mb-16">
          <Image
            src="/brand/logo.png"
            alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
            width={240}
            height={154}
            priority
            className="w-[140px] sm:w-[200px] h-auto"
          />
          <Image
            src="/brand/cow.png"
            alt=""
            width={120}
            height={150}
            className="w-[70px] sm:w-[110px] h-auto opacity-80 hidden sm:block"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="font-script text-bbq-white text-5xl sm:text-7xl mb-4">
            Fan Favorite Voting
          </h1>
          <p className="text-bbq-gray text-base sm:text-lg mb-2">
            November 10&ndash;11, 2026 &middot; Scharbauer Sports Complex, Midland, TX
          </p>
          <p className="max-w-xl text-bbq-gray text-sm sm:text-base mb-10 leading-relaxed">
            Find a cook team&rsquo;s booth, scan their QR code, and tap once to
            cast your vote for Fan Favorite. One scan, one tap &mdash; that&rsquo;s it.
          </p>
          <Link
            href="/leaderboard"
            className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-8 py-4 rounded-sm hover:bg-bbq-bronze transition-colors"
          >
            View Live Leaderboard
          </Link>
        </div>
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
