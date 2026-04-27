import Flag from "@/components/Flag";

type Props = {
  label: string;
  value: string;
  hint?: string;
  accent?: "default" | "crimson" | "gold" | "pitch";
  /** When set, shows a country flag beside the main value (e.g. champion / top pick). */
  team?: string;
};

const ACCENTS: Record<NonNullable<Props["accent"]>, string> = {
  default: "text-ink",
  crimson: "text-crimson-glow",
  gold: "text-gold-soft",
  pitch: "text-pitch",
};

export default function StatPill({ label, value, hint, accent = "default", team }: Props) {
  return (
    <div className="card card-hover cursor-default p-5 transition-shadow duration-200 hover:shadow-card">
      <div className="label">{label}</div>
      <div className="mt-2 flex min-h-[2.75rem] items-center gap-2.5">
        {team ? <Flag team={team} size="sm" className="shrink-0 self-center" /> : null}
        <div
          className={`min-w-0 flex-1 display nums text-3xl leading-none sm:text-4xl ${ACCENTS[accent]} ${team ? "truncate" : ""}`}
        >
          {value}
        </div>
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-ink-faint">{hint}</div>
      ) : null}
    </div>
  );
}
