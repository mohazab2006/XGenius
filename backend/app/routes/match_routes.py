from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.deps import get_prediction
from app.services.prediction_service import PredictionService

router = APIRouter()


@router.get(
    "/predict-match",
    summary="Predict a single head-to-head match (World Cup team pool)",
)
def predict_match(
    team_a: str = Query(..., description="First team (order affects model perspective)"),
    team_b: str = Query(..., description="Second team"),
    pred: PredictionService = Depends(get_prediction),
) -> dict:
    a, b = team_a.strip(), team_b.strip()
    if not a or not b:
        raise HTTPException(status_code=400, detail="team_a and team_b must be non-empty.")
    if a == b:
        raise HTTPException(status_code=400, detail="team_a and team_b must differ.")
    if a not in pred.team_lookup or b not in pred.team_lookup:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Unknown team. Use values from the loaded teams dataset.",
                "valid_examples": list(pred.list_team_names())[:8],
            },
        )
    return pred.predict_match(a, b)
