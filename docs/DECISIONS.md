# Technical decisions (living log)

One-liners. Expand only when it prevents future confusion.

| Date | Area | Decision |
|------|------|----------|
| 2026-04-24 | Phasing | **Frontend after API + sim + Docker**; user will confirm each phase. |
| 2026-04-24 | Git | **Do not** commit `backend/artifacts/`, `mock_matches.csv`, or `__pycache__`; train locally to produce models. |
| 2026-04-24 | ML v1 | **LogisticRegression** (multiclass) for W/D/L; **PoissonRegressor** for goals per side; mock labels from synthetic data until real data is integrated. |
| 2026-04-24 | Sim v1 | R16 pairings: **1A-2B,1C-2D,1E-2F,1G-2H,1B-2A,1D-2C,1F-2E,1H-2G**; knockout ties split **50/50**; requires **32** teams in `teams.csv` order = group draw. |
| 2026-04-25 | Docker | [docker/Dockerfile](docker/Dockerfile) (build from repo root); [docker-compose.yml](docker-compose.yml) service `xgenius-api`; `PYTHON` **3.12** slim; **no Postgres** in Phase 3. |
| 2026-04-27 | Frontend | Next.js 14 App Router + Tailwind; client-side fetch to FastAPI via `NEXT_PUBLIC_API_URL`; no SSR for predictions (keeps the API as the single source of truth). |
|  |  |  |

**Template for new row:** add a row; keep the “Area” field short (e.g. `Sim`, `API`, `Docker`).
