from __future__ import annotations

import joblib
import numpy as np
import pandas as pd

from app.config import FEATURE_COLUMNS_PATH, GOALS_MODEL_PATH, OUTCOME_MODEL_PATH, TEAM_STATS_PATH
from app.models.train import train_and_save_models
from app.utils.features import MatchFeatures, build_match_features, build_team_lookup


class PredictionService:
    def __init__(self) -> None:
        self._load_or_train()

    def _load_or_train(self) -> None:
        if not (OUTCOME_MODEL_PATH.exists() and GOALS_MODEL_PATH.exists() and FEATURE_COLUMNS_PATH.exists()):
            train_and_save_models()

        self.outcome_model = joblib.load(OUTCOME_MODEL_PATH)
        self.goals_model_a, self.goals_model_b = joblib.load(GOALS_MODEL_PATH)
        self.feature_columns: list[str] = joblib.load(FEATURE_COLUMNS_PATH)
        self.team_df = pd.read_csv(TEAM_STATS_PATH)
        self.team_lookup = build_team_lookup(self.team_df)

    def _probs_xg(
        self, team_a: str, team_b: str
    ) -> tuple[dict[str, float], float, float, MatchFeatures]:
        """Raw outcome probabilities and xG for the ordered pair ( team_a, team_b )."""
        feats = build_match_features(team_a, team_b, self.team_lookup)
        x_row = pd.DataFrame([feats.to_dict()])[self.feature_columns]

        class_probs = self.outcome_model.predict_proba(x_row)[0]
        labels = list(self.outcome_model.classes_)
        prob_map = {label: float(p) for label, p in zip(labels, class_probs)}

        ordered = {
            "team_a_win": float(prob_map.get("team_a_win", 0.0)),
            "draw": float(prob_map.get("draw", 0.0)),
            "team_b_win": float(prob_map.get("team_b_win", 0.0)),
        }
        xg_a = float(np.clip(self.goals_model_a.predict(x_row)[0], 0.1, 5.0))
        xg_b = float(np.clip(self.goals_model_b.predict(x_row)[0], 0.1, 5.0))
        return ordered, xg_a, xg_b, feats

    def predict_match(self, team_a: str, team_b: str) -> dict:
        ordered_probs, xg_a, xg_b, feats = self._probs_xg(team_a, team_b)
        display_probs = {
            "team_a_win": round(ordered_probs["team_a_win"], 4),
            "draw": round(ordered_probs["draw"], 4),
            "team_b_win": round(ordered_probs["team_b_win"], 4),
        }
        explanation = self._explain(feats)
        return {
            "team_a": team_a,
            "team_b": team_b,
            "probabilities": display_probs,
            "expected_goals": {"team_a_xg": round(xg_a, 2), "team_b_xg": round(xg_b, 2)},
            "explanation": explanation,
        }

    def get_ordered_outcome_tuple(self, first: str, second: str) -> tuple[float, float, float]:
        """( P(first wins), P(draw), P(second wins) ) for a scheduled fixture (first, second)."""
        probs, _, _, _ = self._probs_xg(first, second)
        return (probs["team_a_win"], probs["draw"], probs["team_b_win"])

    def list_team_names(self) -> list[str]:
        return sorted(self.team_df["team_name"].astype(str).tolist())

    def _explain(self, feats) -> str:
        reasons: list[str] = []
        if feats.xg_diff > 0.08:
            reasons.append("higher xG differential")
        if feats.form_diff > 0.08:
            reasons.append("stronger recent form")
        if feats.elo_diff > 40:
            reasons.append("better team strength (ELO)")

        if not reasons:
            return f"{feats.team_a} and {feats.team_b} look balanced based on current indicators."
        return f"{feats.team_a} is favored due to " + " and ".join(reasons) + "."
