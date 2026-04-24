from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.match_routes import router as match_router
from app.routes.tournament_routes import router as tournament_router
from app.services.prediction_service import PredictionService


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Eagerly load and optionally train the ML models once at startup
    app.state.prediction = PredictionService()
    yield


app = FastAPI(
    title="XGenius",
    description="FIFA World Cup style match prediction and Monte Carlo tournament simulation.",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(match_router, tags=["match"])
app.include_router(tournament_router, tags=["tournament"])


@app.get("/")
def root() -> dict:
    return {
        "name": "XGenius",
        "docs": "/docs",
        "health": "ok",
        "endpoints": ["/predict-match", "/simulate-tournament", "/team-probabilities"],
    }
