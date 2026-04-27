export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line/80 bg-black/40 backdrop-blur">
      <div className="container-x flex flex-col items-start justify-between gap-8 py-12 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-bg-soft/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 text-ink-dim">
            World Cup 2026 · Canada · Mexico · USA
          </div>
          <div>
            <div className="display text-2xl text-ink">XGENIUS</div>
            <div className="mt-1 max-w-md font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">
              Hosts Canada · Mexico · United States — prediction, Monte Carlo simulation, explainable AI
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-xs text-ink-faint sm:max-w-md sm:items-end sm:text-right">
          <span>
            Predictions are statistical estimates from a Monte Carlo engine, not betting or financial advice.
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint/80">
            Not affiliated with FIFA.
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow">
            v0.4 · Phase 4 frontend
          </span>
        </div>
      </div>
    </footer>
  );
}
