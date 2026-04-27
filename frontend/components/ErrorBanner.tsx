export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="card border-bad/40 bg-bad/10 p-5 text-sm text-red-100">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="grid h-8 w-8 place-items-center rounded-lg bg-bad/20 text-base"
        >
          !
        </span>
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-bad">
            Connection error
          </div>
          <div className="mt-1 text-red-100">{message}</div>
          <div className="mt-2 text-xs text-red-200/70">
            Tip: ensure the API is running on{" "}
            <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">
              http://localhost:8000
            </code>{" "}
            (
            <code className="font-mono">docker compose up</code> or{" "}
            <code className="font-mono">uvicorn app.main:app --reload</code>).
          </div>
        </div>
      </div>
    </div>
  );
}
