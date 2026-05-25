interface ProgressBarProps {
  pct: number
  gradient: [string, string]
  height?: number
}

export function ProgressBar({ pct, gradient, height = 8 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div
      className="w-full rounded-full bg-slate-800 overflow-hidden"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${clamped}%`,
          background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        }}
      />
    </div>
  )
}
