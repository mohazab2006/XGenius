import type { TeamRow } from "@/lib/types";
import { abbrOf, groupOf } from "@/lib/teams";
import { pct } from "@/lib/format";
import Flag from "./Flag";

export default function TopContenders({ rows, count = 6 }: { rows: TeamRow[]; count?: number }) {
  const top = [...rows]
    .sort((a, b) => b.probabilities.p_winner - a.probabilities.p_winner)
    .slice(0, count);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {top.map((r, i) => {
        const isChamp = i === 0;
        return (
          <article
            key={r.team}
            className={
              "card card-hover relative overflow-hidden p-5 " +
              (isChamp ? "ring-1 ring-gold/40" : "")
            }
          >
            {isChamp ? (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/15 blur-3xl"
              />
            ) : null}

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Flag team={r.team} size="xl" className="ring-1 ring-white/10" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
                    {abbrOf(r.team)} · Group {groupOf(r.team)}
                  </div>
                  <div className="display text-2xl text-ink">{r.team}</div>
                </div>
              </div>
              <span
                className={
                  "rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-eyebrow " +
                  (isChamp
                    ? "border-gold/40 bg-gold/15 text-gold-soft"
                    : "border-line bg-bg-soft text-ink-faint")
                }
              >
                #{i + 1}
              </span>
            </div>

            <div className="relative mt-5 grid grid-cols-3 gap-2">
              <Stat label="Champion" value={pct(r.probabilities.p_winner, 1)} accent={isChamp ? "gold" : "crimson"} />
              <Stat label="Final" value={pct(r.probabilities.p_reach_final, 0)} />
              <Stat label="Semi" value={pct(r.probabilities.p_reach_semifinals, 0)} />
            </div>
          </article>
        );
      })}
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
  accent?: "default" | "crimson" | "gold";
}) {
  const cls =
    accent === "gold"
      ? "text-gold-soft"
      : accent === "crimson"
        ? "text-crimson-glow"
        : "text-ink";
  return (
    <div className="rounded-lg border border-line/80 bg-bg-soft/60 p-2.5">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink-faint">
        {label}
      </div>
      <div className={`mt-0.5 display nums text-lg ${cls}`}>{value}</div>
    </div>
  );
}
