"use client";

import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "depbbq_admin_ok";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem(STORAGE_KEY) === "1"
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage on mount
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "depbbq2026";
    if (input === expected) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!checked) return null;

  if (!unlocked) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-xs text-center">
          <p className="font-script text-xl text-bbq-gray mb-2">
            Organizer console
          </p>
          <h1 className="font-display text-bbq-gold text-2xl mb-6">
            Enter passcode
          </h1>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-sm px-4 py-3 text-center text-bbq-white mb-3 focus:outline-none focus:border-bbq-gold"
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm mb-3">
              That passcode didn&rsquo;t match.
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-bbq-gold text-bbq-black font-semibold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-bbq-bronze transition-colors"
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
