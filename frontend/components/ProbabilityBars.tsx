import { pct } from "@/lib/format";
import { abbrOf } from "@/lib/teams";
import Flag from "./Flag";

type Props = {
  teamA: string;
  teamB: string;
  pA: number;
  pDraw: number;
  pB: number;
};

export default function ProbabilityBars({ teamA, teamB, pA, pDraw, pB }: Props) {
  const total = pA + pDraw + pB || 1;
  const wA = (pA / total) * 100;
  const wD = (pDraw / total) * 100;
  const wB = (pB / total) * 100;

  return (
    <div className="space-y-5">
      {/* Stacked bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-eyebrow text-ink-faint">
          <span>{abbrOf(teamA)} WIN</span>
          <span>DRAW</span>
          <span>{abbrOf(teamB)} WIN</span>
        </div>
        <div className="overflow-hidden rounded-full border border-line bg-bg-soft">
          <div className="flex h-3 w-full">
            <div
              className="bg-gradient-to-r from-crimson to-crimson-glow"
              style={{ width: `${wA}%` }}
              aria-label={`${teamA} win probability`}
            />
            <div className="bg-line-strong" style={{ width: `${wD}%` }} aria-label="Draw" />
            <div
              className="bg-gradient-to-r from-sky to-pitch"
              style={{ width: `${wB}%` }}
              aria-label={`${teamB} win probability`}
            />
          </div>
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-3">
        <Slice
          accent="crimson"
          label={teamA}
          flag={<Flag team={teamA} size="sm" />}
          value={pA}
        />
        <Slice accent="muted" label="Draw" value={pDraw} />
        <Slice
          accent="pitch"
          label={teamB}
          flag={<Flag team={teamB} size="sm" />}
          value={pB}
        />
      </div>
    </div>
  );
}

function Slice({
  label,
  value,
  accent,
  flag,
}: {
  label: string;
  value: number;
  accent: "crimson" | "pitch" | "muted";
  flag?: React.ReactNode;
}) {
  const dot =
    accent === "crimson"
      ? "bg-crimson"
      : accent === "pitch"
        ? "bg-pitch"
        : "bg-line-strong";
  const text =
    accent === "crimson"
      ? "text-crimson-glow"
      : accent === "pitch"
        ? "text-pitch"
        : "text-ink-dim";

  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-2">
        {flag}
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-eyebrow text-ink-faint">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
          <span className="truncate">{label}</span>
        </div>
      </div>
      <div className={`mt-1 display nums text-3xl ${text}`}>{pct(value, 1)}</div>
    </div>
  );
}
