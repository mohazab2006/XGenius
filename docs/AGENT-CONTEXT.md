# Agent and contributor context

Read this before large changes. It keeps the project consistent with [GOALS.md](GOALS.md) and [EXPECTATIONS.md](EXPECTATIONS.md).

## North star

- **World Cup is the primary product** — Generic league modeling is optional later.
- Prefer **clarity and boring correctness** over clever one-offs.

## Repo rules

- **Minimize diffs** — No unrelated refactors. One concern per commit when possible.
- **Do not commit** generated model binaries, `__pycache__`, or large generated CSVs (see root `.gitignore`).
- **Python** — `backend` is the app root; run training from `backend` with `python -m app.models.train` (after install).

## Conventions (backend)

- **Features** — Centralize in `app/utils/features.py` (or a dedicated `features` module) rather than copy-paste.
- **Models** — `sklearn` baseline first; XGBoost only if it adds value and is wired consistently.
- **Explanations** — Must stay tied to real feature deltas, not static strings.

## When finishing a task

- Update [PHASES.md](PHASES.md) checkboxes and “Current phase”.
- Append [AUDIT-LOG.md](AUDIT-LOG.md) if the change was milestone-sized.
- If a technical choice is non-obvious, one line in [DECISIONS.md](DECISIONS.md).

## User preference (from project chat)

- Build in **phases**; **leave frontend for last** after the user approves the next step. As of 2026-04-25, **Phase 3 (Docker)** is in place. **Phase 4 (Next.js + Tailwind)** is next when the user explicitly starts it; do not begin frontend work until they ask.
