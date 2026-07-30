import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qgc1stk.css" />
      </head>
      <body className="min-h-full flex flex-col bg-bbq-black text-bbq-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
