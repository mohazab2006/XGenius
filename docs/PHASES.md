# Phases and status

> **Current phase:** **Phase 3 — complete**  
> **Next phase:** **Phase 4** — Frontend (Next.js + Tailwind)

| Phase | Scope | Status |
|-------|--------|--------|
| **1** | Backend ML foundation: data + features + train outcome + two Poisson xG + prediction service + explain strings | **Done** |
| **2** | FastAPI: `GET /predict-match`, `GET /simulate-tournament`, `GET /team-probabilities`; Monte Carlo engine (World Cup), JSON contracts | **Done** |
| **3** | Docker: [docker/Dockerfile](docker/Dockerfile), [docker-compose.yml](docker-compose.yml) at repo root, `.dockerignore` | **Done** |
| **4** | Frontend (Next.js + Tailwind last): pages for dashboard, match, tournament; charts as feasible | **Not started** |
| **5** | Hardening: tests, error handling, README “run locally” for full stack, small perf notes for sims | **Optional / ongoing** |

## Phase 1 (done) — deliverables

- [x] `backend/data/teams.csv` (32-team–style pool)
- [x] Mock match generation + `train` script producing artifacts locally (not committed)
- [x] `PredictionService` (probabilities, xG, explanation)

## Phase 2 — must deliver

- [x] `backend/app/main.py` (FastAPI) + `routes/`, CORS, lifespan loading of models
- [x] Montecarlo: 8x4 group stage, FIFA-style R16 bracket, knockouts using ordered match probs + 50-50 draw split
- [x] `n_simulations` default 10,000; configurable query param; seed control
- [x] Per-team: `p_reach_round_of_16` (top-2 in group) … `p_winner` (tournament win)
- [x] `GET /predict-match` includes explanation string

## Phase 3 — must deliver

- [x] [docker/Dockerfile](docker/Dockerfile) (Python 3.12, `uvicorn` entrypoint, port 8000)
- [x] [docker-compose.yml](docker-compose.yml) — service `xgenius-api` → `http://localhost:8000`, health check with `start_period` for first-time training
- [x] [.dockerignore](.dockerignore) — ignore artifacts, venv, caches, frontend `node_modules`

## Phase 4 — must deliver

- [ ] Next.js + Tailwind UI wired to the API
- [ ] No placeholder pages that skip real data

**Rule:** Phases 2 and 3 can overlap slightly, but **frontend is last** per project agreement.
