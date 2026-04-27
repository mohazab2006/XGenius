import Flag from "./Flag";
import { abbrOf, groupOf } from "@/lib/teams";
import { num, pct } from "@/lib/format";

type Props = {
  teamA: string;
  teamB: string;
  pA: number;
  pDraw: number;
  pB: number;
  xgA: number;
  xgB: number;
};

/**
 * Broadcast-style fixture card: TEAM A · VS · TEAM B with the projected scoreline
 * front and centre. Designed to anchor the match prediction page.
 */
export default function MatchCard({ teamA, teamB, pA, pDraw, pB, xgA, xgB }: Props) {
  const fav = pA >= pB ? "A" : "B";
  const favA = fav === "A";

  return (
    <div className="card-elevated relative overflow-hidden p-6 sm:p-10">
      <div aria-hidden className="pitch-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
        {/* Team A */}
        <TeamSide
          team={teamA}
          align="left"
          isFav={favA}
          winProb={pA}
        />

        {/* Centre: VS + scoreline */}
        <div className="order-first flex flex-col items-center sm:order-none">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">
            Projected score
          </div>
          <div className="mt-2 flex items-center gap-4 sm:gap-5">
            <span className="display nums text-display-xl text-ink">{num(xgA, 1)}</span>
            <span className="font-mono text-sm text-ink-faint">VS</span>
            <span className="display nums text-display-xl text-ink">{num(xgB, 1)}</span>
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-eyebrow text-crimson-glow">
            <span className="nums">{pct(pDraw, 1)}</span> draw chance
          </div>
        </div>

        {/* Team B */}
        <TeamSide
          team={teamB}
          align="right"
          isFav={!favA}
          winProb={pB}
        />
      </div>

      {/* Footnote ribbon */}
      <div className="relative mt-8 flex items-center justify-between border-t border-line/80 pt-4 font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
        <span>Group {groupOf(teamA)} · {abbrOf(teamA)}</span>
        <span className="text-ink-dim">XGenius prediction</span>
        <span>Group {groupOf(teamB)} · {abbrOf(teamB)}</span>
      </div>
    </div>
  );
}

function TeamSide({
  team,
  align,
  isFav,
  winProb,
}: {
  team: string;
  align: "left" | "right";
  isFav: boolean;
  winProb: number;
}) {
  return (
    <div
      className={`flex flex-col gap-3 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
    >
      <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <Flag team={team} size="2xl" className="ring-1 ring-white/10" />
        {isFav ? (
          <span className="pill-gold inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow">
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-gold-soft" fill="currentColor" aria-hidden>
              <path d="M6 1.2 7.35 4.4l3.5.5-2.55 2.5.6 3.5L6 9.5 2.1 10.9l.6-3.5L0 4.9l3.5-.5L6 1.2z" />
            </svg>
            Favourite
          </span>
        ) : null}
      </div>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
          {abbrOf(team)}
        </div>
        <div className="display text-display-md text-ink">{team}</div>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
          Win probability
        </div>
        <div className={`display nums text-display-md ${isFav ? "text-crimson-glow" : "text-ink"}`}>
          {pct(winProb, 1)}
        </div>
      </div>
    </div>
  );
}
