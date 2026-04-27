import { num } from "@/lib/format";
import { abbrOf } from "@/lib/teams";
import Flag from "./Flag";

type Props = {
  teamA: string;
  teamB: string;
  xgA: number;
  xgB: number;
};

export default function XGBars({ teamA, teamB, xgA, xgB }: Props) {
  const max = Math.max(xgA, xgB, 1.5);

  const Row = ({
    team,
    xg,
    barClass,
  }: {
    team: string;
    xg: number;
    barClass: string;
  }) => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm">
          <Flag team={team} size="sm" />
          <span className="font-medium text-ink">{team}</span>
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-faint">
            {abbrOf(team)}
          </span>
        </span>
        <span className="font-mono nums text-sm text-ink">{num(xg, 2)} <span className="text-ink-faint">xG</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-soft">
        <div
          className={`${barClass} h-full rounded-full transition-all`}
          style={{ width: `${(xg / max) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <Row team={teamA} xg={xgA} barClass="bg-gradient-to-r from-crimson to-crimson-glow" />
      <Row team={teamB} xg={xgB} barClass="bg-gradient-to-r from-sky to-pitch" />
      <p className="font-mono text-xs uppercase tracking-eyebrow text-ink-faint">
        Expected scoreline ·{" "}
        <span className="nums text-ink">
          {num(xgA, 1)} – {num(xgB, 1)}
        </span>
      </p>
    </div>
  );
}
