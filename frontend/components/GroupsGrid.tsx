import { groupedTeams, abbrOf } from "@/lib/teams";
import Flag from "./Flag";

export default function GroupsGrid() {
  const groups = groupedTeams();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((g) => (
        <div key={g.letter} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
              Group
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-crimson/40 bg-crimson/10 display text-lg text-crimson-glow">
              {g.letter}
            </span>
          </div>
          <ul className="space-y-2.5">
            {g.teams.map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-lg px-1 py-0.5 text-sm hover:bg-bg-soft/60"
              >
                <Flag team={t} size="sm" />
                <span className="flex-1 truncate text-ink">{t}</span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
                  {abbrOf(t)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
