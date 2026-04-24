from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
ARTIFACTS_DIR = BASE_DIR / "artifacts"

TEAM_STATS_PATH = DATA_DIR / "teams.csv"
MATCHES_PATH = DATA_DIR / "mock_matches.csv"

OUTCOME_MODEL_PATH = ARTIFACTS_DIR / "outcome_model.joblib"
GOALS_MODEL_PATH = ARTIFACTS_DIR / "goals_model.joblib"
FEATURE_COLUMNS_PATH = ARTIFACTS_DIR / "feature_columns.joblib"
