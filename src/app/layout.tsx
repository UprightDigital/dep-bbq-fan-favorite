import type { Metadata } from "next";
import { Rye, Oswald, Caveat } from "next/font/google";
import "./globals.css";

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-condensed",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Fan Favorite Voting | Permian Basin BBQ Cook-Off",
  description:
    "Scan your team's QR code to vote for the Fan Favorite award at the Daniel Energy Partners Permian Basin BBQ Cook-Off.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rye.variable} ${oswald.variable} ${caveat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bbq-black text-bbq-white font-condensed antialiased">
        {children}
      </body>
    </html>
  );
}
