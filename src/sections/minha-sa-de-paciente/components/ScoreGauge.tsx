import type { ScoreBand } from '@/../product/sections/minha-sa-de-paciente/types'

interface ScoreGaugeProps {
  value: number
  band: ScoreBand
  label: string
  updatedRelative: string
}

const BAND_COLORS: Record<ScoreBand, { arc: string; text: string; bg: string }> = {
  good: {
    arc: 'stroke-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
  },
  attention: {
    arc: 'stroke-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'from-amber-500/30 via-amber-400/10 to-transparent',
  },
  risk: {
    arc: 'stroke-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'from-rose-500/30 via-rose-400/10 to-transparent',
  },
}

export function ScoreGauge({
  value,
  band,
  label,
  updatedRelative,
}: ScoreGaugeProps) {
  const colors = BAND_COLORS[band]

  // Semicircular arc: 180° from left (270°) to right (90°)
  // Radius 100, centered at (120, 120)
  const radius = 100
  const cx = 120
  const cy = 120
  const startAngle = 180 // left
  const endAngle = 0 // right (sweep clockwise)
  const sweepAngle = startAngle - endAngle // 180

  const valueAngle = startAngle - (value / 100) * sweepAngle

  function polar(angle: number) {
    const rad = (angle * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    }
  }

  const start = polar(startAngle)
  const end = polar(endAngle)
  const valuePoint = polar(valueAngle)

  // Arc path from start to valuePoint
  const largeArc = (startAngle - valueAngle) > 180 ? 1 : 0
  const activePath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${valuePoint.x} ${valuePoint.y}`
  const bgPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`

  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="relative flex flex-col items-center">
      {/* Background glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 mx-auto h-60 w-60 rounded-full bg-gradient-to-br blur-3xl ${colors.bg}`}
      />

      <svg
        viewBox="0 0 240 150"
        className="w-full max-w-[280px]"
        role="img"
        aria-label={`Score ${value} de 100 — ${label}`}
      >
        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        {/* Active arc */}
        <path
          d={activePath}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          className={`${colors.arc} transition-all duration-700`}
        />
        {/* End dot */}
        <circle
          cx={valuePoint.x}
          cy={valuePoint.y}
          r="9"
          className={`${colors.arc} fill-current`}
        />
        <circle
          cx={valuePoint.x}
          cy={valuePoint.y}
          r="4"
          className="fill-white dark:fill-slate-900"
        />
      </svg>

      <div className="-mt-16 flex flex-col items-center">
        <span className="font-mono text-6xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
          {clamped}
        </span>
        <span
          className={`mt-1 text-[11px] font-bold uppercase tracking-[0.25em] ${colors.text}`}
        >
          {label}
        </span>
        <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Score Saúde
        </span>
        <span className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          {updatedRelative}
        </span>
      </div>
    </div>
  )
}
