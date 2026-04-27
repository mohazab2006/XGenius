import type { MatchPrediction, TeamProbsResult, TournamentResult } from "./types";

const API_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:8000";

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      const d = body?.detail;
      if (typeof d === "string") detail = d;
      else if (d?.message) detail = d.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

export function predictMatch(
  teamA: string,
  teamB: string,
  signal?: AbortSignal,
): Promise<MatchPrediction> {
  const qs = new URLSearchParams({ team_a: teamA, team_b: teamB });
  return getJson<MatchPrediction>(`/predict-match?${qs.toString()}`, signal);
}

export function simulateTournament(
  nSimulations: number,
  randomSeed: number,
  signal?: AbortSignal,
): Promise<TournamentResult> {
  const qs = new URLSearchParams({
    n_simulations: String(nSimulations),
    random_seed: String(randomSeed),
  });
  return getJson<TournamentResult>(`/simulate-tournament?${qs.toString()}`, signal);
}

export function teamProbabilities(
  nSimulations: number,
  randomSeed: number,
  signal?: AbortSignal,
): Promise<TeamProbsResult> {
  const qs = new URLSearchParams({
    n_simulations: String(nSimulations),
    random_seed: String(randomSeed),
  });
  return getJson<TeamProbsResult>(`/team-probabilities?${qs.toString()}`, signal);
}

export const apiBaseUrl = API_URL;
