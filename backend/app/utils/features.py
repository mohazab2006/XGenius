from __future__ import annotations

from dataclasses import dataclass

import pandas as pd


@dataclass
class MatchFeatures:
    team_a: str
    team_b: str
    elo_diff: float
    form_diff: float
    xg_diff: float
    goal_balance_diff: float
    defensive_diff: float

    def to_dict(self) -> dict[str, float]:
        return {
            "elo_diff": self.elo_diff,
            "form_diff": self.form_diff,
            "xg_diff": self.xg_diff,
            "goal_balance_diff": self.goal_balance_diff,
            "defensive_diff": self.defensive_diff,
        }


def build_team_lookup(team_df: pd.DataFrame) -> dict[str, dict]:
    required = {
        "team_name",
        "elo_rating",
        "goals_scored",
        "goals_conceded",
        "xg",
        "matches_played",
        "form_score",
    }
    missing = required - set(team_df.columns)
    if missing:
        raise ValueError(f"Missing required team columns: {sorted(missing)}")

    return team_df.set_index("team_name").to_dict(orient="index")


def build_match_features(team_a: str, team_b: str, team_lookup: dict[str, dict]) -> MatchFeatures:
    if team_a not in team_lookup or team_b not in team_lookup:
        raise ValueError(f"Unknown team names: {team_a}, {team_b}")

    a = team_lookup[team_a]
    b = team_lookup[team_b]

    a_goal_balance = (a["goals_scored"] - a["goals_conceded"]) / max(a["matches_played"], 1)
    b_goal_balance = (b["goals_scored"] - b["goals_conceded"]) / max(b["matches_played"], 1)

    a_defense = a["goals_conceded"] / max(a["matches_played"], 1)
    b_defense = b["goals_conceded"] / max(b["matches_played"], 1)

    return MatchFeatures(
        team_a=team_a,
        team_b=team_b,
        elo_diff=a["elo_rating"] - b["elo_rating"],
        form_diff=a["form_score"] - b["form_score"],
        xg_diff=a["xg"] - b["xg"],
        goal_balance_diff=a_goal_balance - b_goal_balance,
        defensive_diff=b_defense - a_defense,
    )
