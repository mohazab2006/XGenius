"use client";

import { useState } from "react";
import TeamSelect from "@/components/TeamSelect";
import MatchCard from "@/components/MatchCard";
import ProbabilityBars from "@/components/ProbabilityBars";
import XGBars from "@/components/XGBars";
import ErrorBanner from "@/components/ErrorBanner";
import { Spinner } from "@/components/Loader";
import { predictMatch } from "@/lib/api";
import type { MatchPrediction } from "@/lib/types";
import { num, pct } from "@/lib/format";

export default function MatchPage() {
  const [teamA, setTeamA] = useState("France");
  const [teamB, setTeamB] = useState("Brazil");
  const [result, setResult] = useState<MatchPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPredict() {
    setError(null);
    setLoading(true);
    try {
      const r = await predictMatch(teamA, teamB);
      setResult(r);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setTeamA(teamB);
    setTeamB(teamA);
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-bg-card/90 to-bg-soft/50 px-6 py-8 sm:px-10 sm:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(620px 280px at 70% 0%, rgba(225,29,46,0.2), transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-pitch"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <div className="eyebrow">Head-to-head</div>
            <span className="rounded-full border border-line/90 bg-black/35 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest2 text-ink-dim backdrop-blur-sm">
              Canada · Mexico · USA 2026
            </span>
          </div>
          <h1 className="mt-4 display text-display-xl text-ink">Match prediction</h1>
          <p className="mt-4 max-w-2xl text-sm text-ink-dim sm:text-base">
            Pick two national teams. The model returns calibrated win / draw / loss
            probabilities, expected goals for each side, and a short rationale.
          </p>
        </div>
      </header>

      {/* Selector */}
      <section className="card p-5 sm:p-7">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
          <TeamSelect label="Team A" value={teamA} onChange={setTeamA} exclude={teamB} id="teamA" />

          <button
            type="button"
            onClick={swap}
            className="btn-ghost h-[46px] sm:mb-[2px]"
            title="Swap teams"
            aria-label="Swap teams"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth="1.8">
              <path d="M3 7h12l-3-3M17 13H5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <TeamSelect label="Team B" value={teamB} onChange={setTeamB} exclude={teamA} id="teamB" />

          <button
            type="button"
            onClick={onPredict}
            disabled={loading}
            className="btn-primary h-[46px] px-6 sm:mb-[2px]"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Predicting…
              </>
            ) : (
              <>Predict</>
            )}
          </button>
        </div>
      </section>

      {error ? <ErrorBanner message={error} /> : null}

      {loading && !result ? (
        <div className="card p-6">
          <Spinner label="Running outcome and xG models…" />
        </div>
      ) : null}

      {result ? (
        <>
          {/* Showpiece match card */}
          <MatchCard
            teamA={result.team_a}
            teamB={result.team_b}
            pA={result.probabilities.team_a_win}
            pDraw={result.probabilities.draw}
            pB={result.probabilities.team_b_win}
            xgA={result.expected_goals.team_a_xg}
            xgB={result.expected_goals.team_b_xg}
          />

          {/* Detail panels */}
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="card p-6 lg:col-span-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="eyebrow">Outcome distribution</div>
                  <h2 className="mt-2 display text-display-md text-ink">Win · Draw · Loss</h2>
                </div>
                <div className="text-right font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
                  Calibrated probabilities
                </div>
              </div>
              <div className="mt-6">
                <ProbabilityBars
                  teamA={result.team_a}
                  teamB={result.team_b}
                  pA={result.probabilities.team_a_win}
                  pDraw={result.probabilities.draw}
                  pB={result.probabilities.team_b_win}
                />
              </div>

              <div className="mt-7 rounded-2xl border border-crimson/25 bg-crimson/5 p-4 sm:p-5">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-crimson-glow">
                  Why this prediction
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  {result.explanation}
                </p>
              </div>
            </section>

            <section className="card p-6">
              <div className="eyebrow">Expected goals</div>
              <h2 className="mt-2 display text-display-md text-ink">Per-side xG</h2>
              <p className="mt-1 text-xs text-ink-faint">
                Poisson estimate · clipped to a sensible range
              </p>
              <div className="mt-6">
                <XGBars
                  teamA={result.team_a}
                  teamB={result.team_b}
                  xgA={result.expected_goals.team_a_xg}
                  xgB={result.expected_goals.team_b_xg}
                />
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <Stat label={`${result.team_a} xG`} value={num(result.expected_goals.team_a_xg, 2)} />
                <Stat label={`${result.team_b} xG`} value={num(result.expected_goals.team_b_xg, 2)} />
                <Stat label="Draw odds" value={pct(result.probabilities.draw, 1)} accent="gold" />
                <Stat
                  label="xG diff"
                  value={num(
                    result.expected_goals.team_a_xg - result.expected_goals.team_b_xg,
                    2,
                  )}
                />
              </div>
            </section>
          </div>
        </>
      ) : !error && !loading ? (
        <section className="card border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-line bg-bg-soft">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M12 5v14" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mt-4 display text-2xl text-ink">Pick your fixture</div>
            <p className="mt-2 text-sm text-ink-dim">
              Choose two teams and run the model to see win / draw / loss
              probabilities, the expected scoreline, and a one-line rationale.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string;
  accent?: "default" | "gold";
}) {
  return (
    <div className="rounded-xl border border-line/80 bg-bg-soft/60 p-3.5">
      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
        {label}
      </div>
      <div className={`mt-1 display nums text-2xl ${accent === "gold" ? "text-gold-soft" : "text-ink"}`}>
        {value}
      </div>
    </div>
  );
}
