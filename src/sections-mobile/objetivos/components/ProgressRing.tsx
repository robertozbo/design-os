interface ProgressRingProps {
  pct: number // 0-100
  size?: number
  stroke?: number
  gradient: [string, string]
  centerLabel: string
  centerSubLabel?: string
}

export function ProgressRing({
  pct,
  size = 80,
  stroke = 8,
  gradient,
  centerLabel,
  centerSubLabel,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, pct))
  const dashOffset = circ * (1 - clamped / 100)
  const gradId = `progress-ring-${gradient[0].replace('#', '')}-${gradient[1].replace('#', '')}`

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[16px] leading-none font-bold text-slate-50 tabular-nums">
          {centerLabel}
        </span>
        {centerSubLabel && (
          <span className="text-slate-400 text-[9px] mt-0.5">{centerSubLabel}</span>
        )}
      </div>
    </div>
  )
}
