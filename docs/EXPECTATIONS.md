# Expectations (quality and delivery)

## Definition of “production-ready” for this repo

- **Runnable locally** with documented steps.
- **No phony placeholders** in user-facing paths (e.g. “TODO implement predict”).
- **Deterministic or documented randomness** where it matters (simulations use a seed or document variance).
- **Data**: Mock data is fine if real APIs are missing; the pipeline must be **real** (load → feature → model → output).
- **Versioned dependencies** in `backend/requirements.txt` (or lockfile if we add one later).
- **Generated artifacts** (model binaries, big CSV) stay **out of git** via `.gitignore` **and** are excluded from Docker build context when possible via **`.dockerignore`**, so images stay lean and the container can train on first boot.
- **Docker**: `docker compose up --build` from the repo root must produce a working API on port **8000** (first boot may take up to a few minutes to train in-container).

## API expectations (once Phase 2 exists)

- JSON responses, stable field names, sensible HTTP status codes.
- Query/body parameters documented; validation errors are readable.

## Frontend expectations (last phase, per plan)

- Simple, clear UX: dashboard, match prediction, tournament simulation.
- Consistent with Tailwind; no broken charts or dead routes.

## Review checklist (use before calling a phase “done”)

- [ ] Matches [GOALS.md](GOALS.md) for that phase
- [ ] [PHASES.md](PHASES.md) status updated
- [ ] [AUDIT-LOG.md](AUDIT-LOG.md) entry added with date
- [ ] New commands or env vars reflected in root **README** when user-facing
- [ ] No unrelated drive-by refactors mixed into the same change
