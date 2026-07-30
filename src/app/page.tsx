import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-brand-hero px-4 sm:px-8 py-6 sm:py-10">
      <div className="brand-frame flex-1 flex flex-col px-6 sm:px-14 py-8 sm:py-12">
        <div className="flex items-start justify-between">
          <Image
            src="/brand/logo.png"
            alt="Daniel Energy Partners Permian Basin BBQ Cook-Off"
            width={240}
            height={154}
            priority
            className="w-[130px] sm:w-[190px] h-auto"
          />
          <Image
            src="/brand/pig.png"
            alt=""
            width={120}
            height={130}
            className="w-[60px] sm:w-[100px] h-auto opacity-90 hidden sm:block"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <span className="inline-flex items-center gap-2 border border-bbq-gold/40 rounded-full px-4 py-1.5 mb-8 text-bbq-gold text-xs uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bbq-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bbq-gold" />
            </span>
            Voting is live
          </span>

          <h1 className="font-script text-bbq-white text-5xl sm:text-7xl mb-6 leading-tight">
            Fan Favorite Voting
          </h1>

          <div className="flex items-center gap-4 w-full max-w-sm mb-6">
            <span className="divider-line flex-1" />
            <p className="text-bbq-gray text-sm sm:text-base whitespace-nowrap">
              Nov 10&ndash;11, 2026 &middot; Midland, TX
            </p>
            <span className="divider-line flex-1" />
          </div>

          <p className="max-w-xl text-bbq-gray text-sm sm:text-base mb-10 leading-relaxed">
            Find a cook team&rsquo;s booth, scan their QR code, and tap once to
            cast your vote for Fan Favorite. One scan, one tap &mdash; that&rsquo;s it.
          </p>

          <Link
            href="/leaderboard"
            className="inline-block bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider text-lg px-10 py-4 rounded-sm hover:bg-bbq-bronze hover:scale-[1.03] transition-all"
          >
            View Live Leaderboard
          </Link>
        </div>

        <div className="flex items-end justify-between">
          <Image
            src="/brand/cow.png"
            alt=""
            width={120}
            height={150}
            className="w-[60px] sm:w-[100px] h-auto opacity-90 hidden sm:block"
          />
          <p className="text-bbq-gray/50 text-xs uppercase tracking-[0.2em] ml-auto">
            Scharbauer Sports Complex
          </p>
        </div>
      </div>

      <footer className="no-print pt-6 text-center">
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
