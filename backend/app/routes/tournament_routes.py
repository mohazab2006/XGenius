from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.deps import get_prediction
from app.services.prediction_service import PredictionService
from app.services.tournament_service import run_world_cup_monte_carlo, team_probabilities_table
from app.utils.seed import resolve_random_seed

router = APIRouter()


@router.get(
    "/simulate-tournament",
    summary="Run Monte Carlo World Cup simulation (default 10,000 runs)",
)
def simulate_tournament(
    n_simulations: int = Query(10_000, ge=1, le=500_000, description="Number of full-tournament sims"),
    random_seed: int = Query(42, description="RNG seed. Use a negative value for a random seed (non-reproducible)"),
    pred: PredictionService = Depends(get_prediction),
) -> dict:
    seed = resolve_random_seed(random_seed)
    try:
        return run_world_cup_monte_carlo(pred, n_simulations=n_simulations, random_seed=seed)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get(
    "/team-probabilities",
    summary="Per-team World Cup stage probabilities (same sim engine as /simulate-tournament)",
)
def team_probabilities(
    n_simulations: int = Query(10_000, ge=1, le=500_000),
    random_seed: int = Query(42),
    pred: PredictionService = Depends(get_prediction),
) -> dict:
    seed = resolve_random_seed(random_seed)
    try:
        return team_probabilities_table(pred, n_simulations=n_simulations, random_seed=seed)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
