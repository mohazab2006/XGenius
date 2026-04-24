from __future__ import annotations

from fastapi import Request

from app.services.prediction_service import PredictionService


def get_prediction(request: Request) -> PredictionService:
    return request.app.state.prediction
