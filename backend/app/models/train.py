from __future__ import annotations

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression, PoissonRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error
from sklearn.model_selection import train_test_split

from app.config import FEATURE_COLUMNS_PATH, GOALS_MODEL_PATH, MATCHES_PATH, OUTCOME_MODEL_PATH
from app.services.data_service import generate_mock_matches


FEATURE_COLUMNS = ["elo_diff", "form_diff", "xg_diff", "goal_balance_diff", "defensive_diff"]


def _prepare_training_data() -> pd.DataFrame:
    if not MATCHES_PATH.exists():
        return generate_mock_matches()
    return pd.read_csv(MATCHES_PATH)


def train_outcome_model(df: pd.DataFrame) -> tuple[LogisticRegression, float]:
    X = df[FEATURE_COLUMNS]
    y = df["result"]
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )
    model = LogisticRegression(max_iter=1200)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    return model, accuracy


def train_goals_model(df: pd.DataFrame) -> tuple[PoissonRegressor, PoissonRegressor, float]:
    X = df[FEATURE_COLUMNS]
    y_a = df["goals_a"]
    y_b = df["goals_b"]

    Xa_train, Xa_test, ya_train, ya_test = train_test_split(X, y_a, test_size=0.2, random_state=42)
    Xb_train, Xb_test, yb_train, yb_test = train_test_split(X, y_b, test_size=0.2, random_state=42)

    model_a = PoissonRegressor(alpha=1e-4, max_iter=400)
    model_b = PoissonRegressor(alpha=1e-4, max_iter=400)
    model_a.fit(Xa_train, ya_train)
    model_b.fit(Xb_train, yb_train)

    mae_a = mean_absolute_error(ya_test, model_a.predict(Xa_test))
    mae_b = mean_absolute_error(yb_test, model_b.predict(Xb_test))
    return model_a, model_b, (mae_a + mae_b) / 2


def train_and_save_models() -> dict[str, float]:
    df = _prepare_training_data()
    outcome_model, accuracy = train_outcome_model(df)
    goals_model_a, goals_model_b, goals_mae = train_goals_model(df)

    OUTCOME_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(outcome_model, OUTCOME_MODEL_PATH)
    joblib.dump((goals_model_a, goals_model_b), GOALS_MODEL_PATH)
    joblib.dump(FEATURE_COLUMNS, FEATURE_COLUMNS_PATH)

    return {"outcome_accuracy": round(accuracy, 4), "goals_mae": round(goals_mae, 4)}


if __name__ == "__main__":
    metrics = train_and_save_models()
    print("Training completed:", metrics)
