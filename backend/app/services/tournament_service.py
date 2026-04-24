from __future__ import annotations

from typing import Any

import numpy as np
from numpy.random import Generator

from app.services.prediction_service import PredictionService

# 32 teams: 8 groups A–H; bracket follows FIFA 2022-style R16 pairings
NUM_GROUPS = 8
TEAMS_PER_GROUP = 4
GROUP_STAGE_PAIRS: list[tuple[int, int]] = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)]
# (group W, group 2nd-opponent): 1A-2B, 1C-2D, 1E-2F, 1G-2H, 1B-2A, 1D-2C, 1F-2E, 1H-2G
R16_FIXTURES: list[tuple[int, int]] = [
    (0, 1),
    (2, 3),
    (4, 5),
    (6, 7),
    (1, 0),
    (3, 2),
    (5, 4),
    (7, 6),
]


def _bracket_winner_3way(p_first: float, p_draw: float, p_second: float, rng: Generator) -> int:
    """0 = first wins, 1 = draw, 2 = second wins. Probabilities renormalized for numerical safety."""
    s = p_first + p_draw + p_second
    if s <= 0:
        s = 1.0
    a, b, c = p_first / s, p_draw / s, p_second / s
    u = float(rng.random())
    if u < a:
        return 0
    if u < a + b:
        return 1
    return 2


def build_outcome_cache(
    pred: PredictionService, team_order: list[str]
) -> dict[tuple[str, str], tuple[float, float, float]]:
    """
    (first, second) -> (P(first), P(draw), P(second)) for the scheduled home/away in that order.
    Fills all ordered pairs; each unordered pair calls the model once.
    """
    cache: dict[tuple[str, str], tuple[float, float, float]] = {}
    for i, a in enumerate(team_order):
        for b in team_order[i + 1 :]:
            t = pred.get_ordered_outcome_tuple(a, b)
            cache[(a, b)] = t
            cache[(b, a)] = (t[2], t[1], t[0])
    return cache


def _elo(lookup: dict, name: str) -> float:
    return float(lookup[name]["elo_rating"])


def simulate_group_stage(
    group_teams: list[str], cache: dict, lookup: dict, rng: Generator
) -> tuple[str, str]:
    """One round-robin group. Returns (first, second) by points then Elo."""
    teams = list(group_teams)
    n = len(teams)
    if n != TEAMS_PER_GROUP:
        raise ValueError("Each group must have 4 teams for the World Cup format.")

    points = {t: 0.0 for t in teams}
    for i, j in GROUP_STAGE_PAIRS:
        t1, t2 = teams[i], teams[j]
        p1, p_draw, p2 = cache[(t1, t2)]
        o = _bracket_winner_3way(p1, p_draw, p2, rng)
        if o == 0:
            points[t1] += 3.0
        elif o == 1:
            points[t1] += 1.0
            points[t2] += 1.0
        else:
            points[t2] += 3.0

    ranked = sorted(teams, key=lambda t: (-points[t], -_elo(lookup, t)))
    return ranked[0], ranked[1]


def _knockout_winner(
    first: str, second: str, cache: dict[tuple[str, str], tuple[float, float, float]], rng: Generator
) -> str:
    """Tie: split draw 50-50; first in fixture = team_a in the model."""
    p_f, p_d, p_s = cache[(first, second)]
    p_first_adv = p_f + 0.5 * p_d
    p_second_adv = p_s + 0.5 * p_d
    tot = p_first_adv + p_second_adv
    if tot <= 0:
        p_first_adv = 0.5
        tot = 1.0
    p_first_adv /= tot
    return first if float(rng.random()) < p_first_adv else second


def simulate_single_world_cup(
    team_order: list[str], cache: dict, lookup: dict, rng: Generator, team_index: dict[str, int]
) -> np.ndarray:
    """
    One full tournament. Returns flags shape (32, 5):
    r16, qf, semis, final, win — each 0/1.
    r16: advanced from group (in top 2).
    qf, semis, final, win: reached that round or beyond (binary per round definition below).
    """
    n = len(team_order)
    if n != 32:
        raise ValueError("World Cup simulation expects 32 national teams in data.")

    out = np.zeros((n, 5), dtype=np.int8)

    first_place: list[str] = []
    second_place: list[str] = []
    for g in range(NUM_GROUPS):
        gteams = team_order[g * TEAMS_PER_GROUP : (g + 1) * TEAMS_PER_GROUP]
        t1, t2 = simulate_group_stage(gteams, cache, lookup, rng)
        first_place.append(t1)
        second_place.append(t2)

    for t in first_place + second_place:
        out[team_index[t], 0] = 1

    r16: list[str] = []
    for w_idx, s_idx in R16_FIXTURES:
        r16.append(
            _knockout_winner(
                first_place[w_idx], second_place[s_idx], cache, rng
            )
        )
    w49, w50, w51, w52, w53, w54, w55, w56 = r16
    for t in r16:
        out[team_index[t], 1] = 1

    q1 = _knockout_winner(w49, w50, cache, rng)
    q2 = _knockout_winner(w51, w52, cache, rng)
    q3 = _knockout_winner(w53, w54, cache, rng)
    q4 = _knockout_winner(w55, w56, cache, rng)
    qf = [q1, q2, q3, q4]
    for t in qf:
        out[team_index[t], 2] = 1

    s1 = _knockout_winner(q1, q2, cache, rng)
    s2 = _knockout_winner(q3, q4, cache, rng)
    for t in (s1, s2):
        out[team_index[t], 3] = 1
    champ = _knockout_winner(s1, s2, cache, rng)
    out[team_index[champ], 4] = 1
    return out


def run_world_cup_monte_carlo(
    pred: PredictionService, n_simulations: int = 10_000, random_seed: int = 42
) -> dict[str, Any]:
    if n_simulations < 1:
        raise ValueError("n_simulations must be at least 1")

    team_order = [str(t) for t in pred.team_df["team_name"].tolist()]
    if len(team_order) != 32:
        raise ValueError("Dataset must contain exactly 32 teams for the World Cup model.")

    cache = build_outcome_cache(pred, team_order)
    team_index = {name: i for i, name in enumerate(team_order)}
    lookup = pred.team_lookup
    rng = np.random.default_rng(random_seed)

    totals = np.zeros((32, 5), dtype=np.int64)
    for _ in range(n_simulations):
        tot = simulate_single_world_cup(team_order, cache, lookup, rng, team_index)
        totals += tot

    float_n = float(n_simulations)
    col_names = ["p_reach_round_of_16", "p_reach_quarterfinals", "p_reach_semifinals", "p_reach_final", "p_winner"]
    teams_out: list[dict[str, Any]] = []
    for i, name in enumerate(team_order):
        entry = {
            "team": name,
            "probabilities": {
                col_names[j]: round(float(totals[i, j] / float_n), 4) for j in range(5)
            },
        }
        teams_out.append(entry)

    teams_out.sort(key=lambda x: x["probabilities"]["p_winner"], reverse=True)

    return {
        "tournament": "FIFA World Cup (32 teams, 8 x 4 group stage, bracket per Phase 2 engine)",
        "n_simulations": n_simulations,
        "random_seed_used": int(random_seed),
        "bracket": {
            "r16": "1A-2B,1C-2D,1E-2F,1G-2H,1B-2A,1D-2C,1F-2E,1H-2G",
            "knockout_tie": "Draw outcomes split 50-50; advancement uses that split plus 90' win",
        },
        "teams": teams_out,
    }


def team_probabilities_table(
    pred: PredictionService, n_simulations: int, random_seed: int
) -> dict[str, Any]:
    """Slimmer payload for the team table endpoint."""
    data = run_world_cup_monte_carlo(
        pred, n_simulations=n_simulations, random_seed=random_seed
    )
    return {
        "n_simulations": data["n_simulations"],
        "random_seed_used": data["random_seed_used"],
        "teams": data["teams"],
    }
