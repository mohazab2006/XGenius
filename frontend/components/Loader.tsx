export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-dim">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-line border-t-crimson" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="shimmer h-12 rounded-xl" />
      ))}
    </div>
  );
}
