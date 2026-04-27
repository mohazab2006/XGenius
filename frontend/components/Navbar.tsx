"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/match", label: "Match" },
  { href: "/tournament", label: "Tournament" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30">
      {/* Top broadcast strip */}
      <div className="border-b border-line/80 bg-black/60 backdrop-blur-md">
        <div className="container-x flex h-7 items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-eyebrow text-ink-faint">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-crimson animate-ticker-pulse" />
            <span className="hidden sm:inline">Live · World Cup engine</span>
            <span className="sm:hidden">Live</span>
          </span>
          <span className="hidden text-ink-faint/90 sm:inline md:hidden">
            Canada · Mexico · USA 2026
          </span>
          <span className="hidden md:inline">10,000-run Monte Carlo · xG · ML outcome model</span>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            API ↗
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-line/80 bg-bg/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex cursor-pointer items-center gap-3">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 transition duration-200 group-hover:ring-white/20">
              <Image
                src="/x.png"
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-contain p-0.5"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="display text-2xl text-ink transition-colors duration-200 group-hover:text-white">
                XGENIUS
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">
                FIFA World Cup · AI predictions
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "relative cursor-pointer rounded-lg px-3.5 py-2 font-mono text-xs uppercase tracking-eyebrow transition-colors duration-200 " +
                    (active
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink")
                  }
                >
                  {l.label}
                  {active ? (
                    <span className="absolute -bottom-[14px] left-3 right-3 h-[2px] bg-gradient-to-r from-crimson to-gold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/match"
            className="hidden cursor-pointer btn-primary sm:inline-flex"
          >
            Predict a match
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Mobile nav */}
        <nav className="container-x flex gap-1 overflow-x-auto pb-2 sm:hidden">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "shrink-0 cursor-pointer rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-eyebrow transition-colors duration-200 " +
                  (active
                    ? "bg-crimson/15 text-crimson-glow"
                    : "text-ink-faint hover:bg-bg-soft hover:text-ink")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
