from __future__ import annotations

import random
from pathlib import Path

import numpy as np
import pandas as pd

from app.config import MATCHES_PATH, TEAM_STATS_PATH
from app.utils.features import build_match_features, build_team_lookup


def load_team_data(path: Path = TEAM_STATS_PATH) -> pd.DataFrame:
    return pd.read_csv(path)


def _sample_goals(lam: float) -> int:
    lam = max(lam, 0.15)
    return int(np.random.poisson(lam=lam))


def generate_mock_matches(
    n_matches: int = 600,
    random_seed: int = 42,
    team_path: Path = TEAM_STATS_PATH,
    output_path: Path = MATCHES_PATH,
) -> pd.DataFrame:
    random.seed(random_seed)
    np.random.seed(random_seed)

    teams = load_team_data(team_path)
    team_lookup = build_team_lookup(teams)
    team_names = list(team_lookup.keys())
    rows: list[dict] = []

    for _ in range(n_matches):
        team_a, team_b = random.sample(team_names, k=2)
        feats = build_match_features(team_a, team_b, team_lookup)
        matchup_balance = 0.45 * feats.elo_diff / 400 + 0.35 * feats.xg_diff + 0.20 * feats.form_diff

        base_a = 1.30 + matchup_balance
        base_b = 1.15 - matchup_balance
        goals_a = _sample_goals(base_a)
        goals_b = _sample_goals(base_b)

        if goals_a > goals_b:
            result = "team_a_win"
        elif goals_b > goals_a:
            result = "team_b_win"
        else:
            result = "draw"

        row = {
            "team_a": team_a,
            "team_b": team_b,
            **feats.to_dict(),
            "goals_a": goals_a,
            "goals_b": goals_b,
            "result": result,
        }
        rows.append(row)

    df = pd.DataFrame(rows)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    return df
