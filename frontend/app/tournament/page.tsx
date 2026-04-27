"use client";

import { useState } from "react";
import StatPill from "@/components/StatPill";
import TopContenders from "@/components/TopContenders";
import TeamProbsTable from "@/components/TeamProbsTable";
import ErrorBanner from "@/components/ErrorBanner";
import { Spinner } from "@/components/Loader";
import { simulateTournament } from "@/lib/api";
import type { TournamentResult } from "@/lib/types";
import { compactInt, pct } from "@/lib/format";

const PRESETS = [1000, 5000, 10000, 25000, 50000];

export default function TournamentPage() {
  const [nSims, setNSims] = useState(10000);
  const [seed, setSeed] = useState(42);
  const [randomSeed, setRandomSeed] = useState(false);

  const [result, setResult] = useState<TournamentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  async function onRun() {
    setError(null);
    setLoading(true);
    const t0 = performance.now();
    try {
      const seedToUse = randomSeed ? -1 : seed;
      const r = await simulateTournament(nSims, seedToUse);
      setResult(r);
      setElapsedMs(performance.now() - t0);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const champion = result?.teams[0];

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-bg-card/95 to-bg-soft/60 p-8 sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(700px 360px at 90% 0%, rgba(225,29,46,0.25), transparent 55%), radial-gradient(560px 320px at 0% 100%, rgba(245,200,66,0.12), transparent 55%)",
          }}
        />
        <div aria-hidden className="pitch-grid pointer-events-none absolute inset-0 opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-pitch"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <div className="eyebrow">Monte Carlo · Full bracket</div>
            <span className="rounded-full border border-line/90 bg-black/35 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest2 text-ink-dim backdrop-blur-sm">
              Canada · Mexico · USA 2026
            </span>
          </div>
          <h1 className="mt-4 display text-display-xl text-ink">Tournament simulation</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-dim sm:text-lg">
            Roll thousands of complete tournaments — group tables, knockout draws, and
            tie-break logic — then read off each nation&apos;s odds to reach every round
            and lift the trophy.
          </p>
        </div>
      </header>

      {/* Controls */}
      <section className="card p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line/70 pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-crimson-glow">
              Simulation controls
            </div>
            <p className="mt-1 text-sm text-ink-dim">
              Tune run count and seed, then execute a full World Cup sweep.
            </p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr_auto]">
          <div>
            <span className="label">Number of simulations</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNSims(p)}
                  className={
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors duration-200 " +
                    (nSims === p
                      ? "border-crimson/50 bg-crimson/15 text-crimson-glow"
                      : "border-line bg-bg-soft text-ink-dim hover:border-line-strong hover:text-ink")
                  }
                >
                  {compactInt(p)}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="range"
                min={100}
                max={50000}
                step={100}
                value={nSims}
                onChange={(e) => setNSims(Number(e.target.value))}
                className="w-full accent-crimson"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-ink-faint">
                <span>100</span>
                <span className="font-mono text-ink">
                  {nSims.toLocaleString()} runs
                </span>
                <span>50,000</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="label">Random seed</span>
              <input
                type="number"
                value={seed}
                disabled={randomSeed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="input mt-1.5"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-dim">
              <input
                type="checkbox"
                checked={randomSeed}
                onChange={(e) => setRandomSeed(e.target.checked)}
                className="h-4 w-4 accent-crimson"
              />
              Use random seed (non-reproducible)
            </label>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={onRun}
              disabled={loading}
              className="btn-primary h-[46px] w-full cursor-pointer px-6 text-base sm:w-auto disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Simulating…
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 text-white/95"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.875 15H9.375a6.003 6.003 0 014.874-11.764M5.25 4.236V18.75m13.5-13.514V18.75"
                    />
                  </svg>
                  Run simulation
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-faint">
          Larger runs = tighter probabilities. 10,000 is a balanced default; 50,000
          can take noticeably longer.
        </p>
      </section>

      {error ? <ErrorBanner message={error} /> : null}

      {loading && !result ? (
        <div className="card p-6">
          <Spinner label={`Rolling ${nSims.toLocaleString()} World Cups…`} />
        </div>
      ) : null}

      {result ? (
        <>
          {/* Headline stats */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill
              label="Simulations"
              value={result.n_simulations.toLocaleString()}
              hint={`Seed ${result.random_seed_used}`}
            />
            <StatPill
              label="Champion (top pick)"
              value={champion ? champion.team : "—"}
              hint={
                champion ? `${pct(champion.probabilities.p_winner, 1)} of runs` : ""
              }
              accent="gold"
              team={champion?.team}
            />
            <StatPill
              label="Reaches final"
              value={
                champion ? pct(champion.probabilities.p_reach_final, 1) : "—"
              }
              hint={champion ? `${champion.team}'s odds` : ""}
            />
            <StatPill
              label="Compute time"
              value={elapsedMs ? `${(elapsedMs / 1000).toFixed(2)}s` : "—"}
              hint="Round-trip incl. network"
            />
          </section>

          {/* Top contenders */}
          <section>
            <SectionTitle
              eyebrow="Podium"
              title="Top contenders"
              subtitle="Teams ranked by probability of winning the final."
            />
            <div className="mt-5">
              <TopContenders rows={result.teams} count={6} />
            </div>
          </section>

          {/* Full table */}
          <section>
            <SectionTitle
              eyebrow="All teams"
              title="Per-team progression odds"
              subtitle="Click any column header to sort. Heat shading scales with probability."
            />
            <div className="mt-5">
              <TeamProbsTable rows={result.teams} />
            </div>
          </section>

          {/* Bracket info */}
          <section className="card p-5">
            <SectionTitle
              eyebrow="Engine"
              title="Bracket configuration"
              subtitle="Fixed FIFA-style R16 pairings; knockout ties split 50-50."
            />
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="label">R16 pairings</dt>
                <dd className="mt-1 break-all font-mono text-ink">
                  {result.bracket.r16}
                </dd>
              </div>
              <div>
                <dt className="label">Knockout ties</dt>
                <dd className="mt-1 text-ink">{result.bracket.knockout_tie}</dd>
              </div>
            </dl>
          </section>
        </>
      ) : !error && !loading ? (
        <section className="card border-dashed p-10 text-center text-sm text-ink-dim">
          Configure the runs and seed, then{" "}
          <span className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-xs text-ink">
            Run simulation
          </span>{" "}
          to see World Cup-wide probabilities.
        </section>
      ) : null}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-line/70 pb-5">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-crimson-glow">
        {eyebrow}
      </div>
      <h2 className="mt-3 display text-display-lg text-ink">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-sm text-ink-dim">{subtitle}</p> : null}
    </div>
  );
}
