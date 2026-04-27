"use client";

import { useMemo, useState } from "react";
import type { TeamRow } from "@/lib/types";
import { abbrOf, groupOf } from "@/lib/teams";
import { pct } from "@/lib/format";
import Flag from "./Flag";

type Col =
  | "team"
  | "p_reach_round_of_16"
  | "p_reach_quarterfinals"
  | "p_reach_semifinals"
  | "p_reach_final"
  | "p_winner";

const HEADERS: { key: Col; label: string; short?: string }[] = [
  { key: "team", label: "Team" },
  { key: "p_reach_round_of_16", label: "Round of 16", short: "R16" },
  { key: "p_reach_quarterfinals", label: "Quarterfinals", short: "QF" },
  { key: "p_reach_semifinals", label: "Semifinals", short: "SF" },
  { key: "p_reach_final", label: "Final", short: "F" },
  { key: "p_winner", label: "Champion", short: "WIN" },
];

function HeatCell({ value, isWinner = false }: { value: number; isWinner?: boolean }) {
  const w = Math.min(1, Math.max(0, value));
  const bg = isWinner
    ? `linear-gradient(90deg, rgba(245,200,66,${0.08 + w * 0.55}) 0%, rgba(255,230,138,${0.04 + w * 0.35}) 100%)`
    : `linear-gradient(90deg, rgba(225,29,46,${0.08 + w * 0.45}) 0%, rgba(61,165,255,${0.04 + w * 0.25}) 100%)`;
  return (
    <div className="relative">
      <div
        className="absolute inset-y-1 left-0 right-0 -mx-1 rounded-md"
        style={{ background: bg, opacity: w > 0 ? 1 : 0 }}
        aria-hidden
      />
      <span className={`relative font-mono nums text-sm ${isWinner ? "text-gold-soft" : "text-ink"}`}>
        {pct(value, 1)}
      </span>
    </div>
  );
}

export default function TeamProbsTable({ rows }: { rows: TeamRow[] }) {
  const [sortBy, setSortBy] = useState<Col>("p_winner");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortBy === "team") {
        av = a.team;
        bv = b.team;
      } else {
        av = a.probabilities[sortBy];
        bv = b.probabilities[sortBy];
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortBy, dir]);

  function setSort(col: Col) {
    if (col === sortBy) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setDir(col === "team" ? "asc" : "desc");
    }
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-bg-card/95 backdrop-blur-sm">
            <tr className="border-b border-line">
              <th className="w-10 px-3 py-3 text-left font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
                #
              </th>
              {HEADERS.map((h) => {
                const active = sortBy === h.key;
                return (
                  <th
                    key={h.key}
                    scope="col"
                    aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
                    className="cursor-pointer select-none whitespace-nowrap px-4 py-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint hover:text-ink"
                    onClick={() => setSort(h.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="hidden sm:inline">{h.label}</span>
                      <span className="sm:hidden">{h.short ?? h.label}</span>
                      <span className={active ? "text-crimson-glow" : "text-ink-faint"}>
                        {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {sorted.map((r, i) => {
              const rank = i + 1;
              const podium = sortBy === "p_winner" && i < 3;
              return (
                <tr key={r.team} className="hover:bg-bg-raised/60">
                  <td className="px-3 py-3 align-middle">
                    <span
                      className={
                        "inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] " +
                        (podium
                          ? i === 0
                            ? "bg-gold/15 text-gold-soft ring-1 ring-gold/40"
                            : "bg-crimson/15 text-crimson-glow ring-1 ring-crimson/40"
                          : "bg-bg-soft text-ink-faint")
                      }
                    >
                      {rank}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Flag team={r.team} size="md" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{r.team}</div>
                        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint">
                          {abbrOf(r.team)} · Group {groupOf(r.team)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><HeatCell value={r.probabilities.p_reach_round_of_16} /></td>
                  <td className="px-4 py-3"><HeatCell value={r.probabilities.p_reach_quarterfinals} /></td>
                  <td className="px-4 py-3"><HeatCell value={r.probabilities.p_reach_semifinals} /></td>
                  <td className="px-4 py-3"><HeatCell value={r.probabilities.p_reach_final} /></td>
                  <td className="px-4 py-3"><HeatCell value={r.probabilities.p_winner} isWinner /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
