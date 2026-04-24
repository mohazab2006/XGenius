# Goals

## Primary (non-negotiable)

XGenius is an **AI-powered World Cup** prediction and simulation system. The **FIFA World Cup** is the main user story, not a generic “any match” demo.

Deliver:

1. **Match prediction** — Win / draw / loss probabilities for a head-to-head matchup.
2. **Expected goals (xG)** — Per-team xG (or expected scoreline) for that matchup.
3. **Tournament simulation** — Monte Carlo over the full World Cup (groups + knockouts) with a large run count (e.g. 10,000+).
4. **Progression and winner probabilities** — Per team: P(reach R16, QF, SF, final, win) as applicable to the draw structure we implement.
5. **Explanations** — Short, human-readable rationale tied to model inputs (e.g. form, xG differential, strength).

## Secondary (nice to have, after core works)

- Live or periodic data refresh; clearer separation of “static snapshot” vs “ingestion pipeline”
- Player- or injury-level modeling
- Other competitions (Champions League, Euros) as **expansions**, not replacements for the World Cup focus

## Out of scope (unless explicitly re-scoped)

- “Black box” predictions with no explanation
- A UI-only or API-only stub that does not run end-to-end (world Cup sim must be real)
