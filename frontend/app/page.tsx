"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatPill from "@/components/StatPill";
import TopContenders from "@/components/TopContenders";
import GroupsGrid from "@/components/GroupsGrid";
import ErrorBanner from "@/components/ErrorBanner";
import { SkeletonRows } from "@/components/Loader";
import Flag from "@/components/Flag";
import { teamProbabilities } from "@/lib/api";
import type { TeamRow } from "@/lib/types";
import { TEAM_NAMES, abbrOf } from "@/lib/teams";

const HERO_FLAGS = [
  "Brazil",
  "Argentina",
  "France",
  "England",
  "Spain",
  "Germany",
  "Portugal",
  "Netherlands",
  "Croatia",
  "Morocco",
  "Japan",
  "USA",
];

export default function DashboardPage() {
  const [rows, setRows] = useState<TeamRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  useEffect(() => {
    const ctl = new AbortController();
    const t0 = performance.now();
    teamProbabilities(2000, 42, ctl.signal)
      .then((r) => {
        setRows(r.teams);
        setElapsedMs(performance.now() - t0);
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => ctl.abort();
  }, []);

  const champ = rows?.[0];

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-bg-card/90 to-bg-soft/70 p-8 sm:p-12 lg:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(900px 480px at 80% -20%, rgba(225,29,46,0.32), transparent 60%), radial-gradient(700px 420px at 0% 110%, rgba(245,200,66,0.18), transparent 60%)",
          }}
        />
        <div aria-hidden className="pitch-grid pointer-events-none absolute inset-0 opacity-60" />
        {/* FIFA-style accent stripe */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-pitch opacity-90"
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <div className="eyebrow">FIFA World Cup · 32 teams · 8 groups</div>
            <span className="rounded-full border border-line/90 bg-black/35 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest2 text-ink-dim backdrop-blur-sm">
              Canada · Mexico · USA 2026
            </span>
          </div>
          <h1 className="mt-5 display text-display-2xl text-ink">
            PREDICT EVERY MATCH.
            <br />
            <span className="bg-gradient-to-r from-crimson via-crimson-glow to-gold bg-clip-text text-transparent">
              SIMULATE THE TOURNAMENT.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-ink-dim sm:text-lg">
            XGenius blends expected goals, machine-learned outcome models, and
            10,000-run Monte Carlo simulation to forecast head-to-head matches and
            project a team's path through the groups, knockouts, and the final.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/match" className="btn-primary px-5 py-3 text-base">
              Predict a match
              <span aria-hidden>→</span>
            </Link>
            <Link href="/tournament" className="btn-ghost px-5 py-3 text-base">
              Run a tournament simulation
            </Link>
          </div>

          {/* Flag ribbon */}
          <div className="mt-12 -mx-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
              Featuring
            </span>
            {HERO_FLAGS.map((t) => (
              <span
                key={t}
                className="inline-flex cursor-default items-center gap-1.5 rounded-md border border-line/80 bg-bg-soft/70 px-2 py-1 transition-colors duration-200 hover:border-line-strong hover:bg-bg-raised/80"
              >
                <Flag team={t} size="sm" />
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-dim">
                  {abbrOf(t)}
                </span>
              </span>
            ))}
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
              + {TEAM_NAMES.length - HERO_FLAGS.length} more
            </span>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill label="Teams" value="32" hint="8 groups · 4 per group" />
          <StatPill label="Default sims" value="10K" hint="Monte Carlo, configurable" accent="crimson" />
          <StatPill label="Outcomes / match" value="W·D·L" hint="+ per-side xG" />
          <StatPill
            label="Top pick"
            value={champ ? `${(champ.probabilities.p_winner * 100).toFixed(1)}%` : "—"}
            hint={champ ? `${champ.team} · live preview` : "Loading preview…"}
            accent="gold"
            team={champ?.team}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section>
        <SectionHeader
          eyebrow="The pipeline"
          title="How XGenius makes a prediction"
          subtitle="Three layers, one explainable output."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Feature
            step="01"
            title="Outcome model"
            body="Logistic regression over team strength, xG differential, and recent form yields calibrated W / D / L probabilities."
          />
          <Feature
            step="02"
            title="Expected goals"
            body="Per-side Poisson regressors estimate the expected scoreline alongside the outcome distribution."
          />
          <Feature
            step="03"
            title="Monte Carlo bracket"
            body="Thousands of full tournaments roll out group-stage points and knockout draws to surface progression odds."
          />
        </div>
      </section>

      {/* LIVE TOP CONTENDERS */}
      <section>
        <SectionHeader
          eyebrow="Live preview"
          title="Top World Cup contenders"
          subtitle={
            elapsedMs
              ? `Based on a 2,000-run preview · computed in ${elapsedMs.toFixed(0)} ms`
              : "Based on a fast 2,000-run preview from the live API"
          }
          right={
            <Link
              href="/tournament"
              className="font-mono text-xs uppercase tracking-eyebrow text-crimson-glow hover:underline"
            >
              Run full simulation →
            </Link>
          }
        />
        <div className="mt-8">
          {error ? (
            <ErrorBanner message={error} />
          ) : !rows ? (
            <SkeletonRows rows={3} />
          ) : (
            <TopContenders rows={rows} count={6} />
          )}
        </div>
      </section>

      {/* GROUPS */}
      <section>
        <SectionHeader
          eyebrow="The draw"
          title="Group stage"
          subtitle="32 teams, 8 groups, 4 per group — exactly as the engine sees them."
        />
        <div className="mt-8">
          <GroupsGrid />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line/80 pb-5">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-3 display text-display-lg text-ink">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-ink-dim">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

function Feature({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="card card-hover p-6">
      <div className="font-mono text-xs uppercase tracking-eyebrow text-crimson-glow">
        {step}
      </div>
      <div className="mt-3 display text-2xl text-ink">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{body}</p>
    </div>
  );
}
