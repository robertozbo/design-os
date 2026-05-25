import { TrendingDown, TrendingUp } from 'lucide-react'
import type { MoodChart } from '@/../product/sections/mental-health/types'
import { CardShell } from './CardShell'

interface Props {
  chart: MoodChart
  onNavigate?: () => void
  revealIndex?: number
}

export function MoodTrendCard({ chart, onNavigate, revealIndex = 0 }: Props) {
  const max = 10
  const min = 1
  const positive = chart.deltaLabel.trim().startsWith('+')
  const TrendIcon = positive ? TrendingUp : TrendingDown
  const trendColor = positive
    ? 'text-teal-600 dark:text-teal-400'
    : 'text-violet-600 dark:text-violet-400'

  return (
    <CardShell
      eyebrow="Humor"
      title="Últimos 7 dias"
      meta={chart.rangeLabel}
      accent="teal"
      onNavigate={onNavigate}
      revealIndex={revealIndex}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
            Média
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
              {chart.average.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 10</span>
          </div>
          <div className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{chart.deltaLabel}</span>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
          {chart.trendLabel}
        </span>
      </div>

      <div className="mt-5">
        <SparkChart days={chart.days} min={min} max={max} />
      </div>
    </CardShell>
  )
}

function SparkChart({
  days,
  min,
  max,
}: {
  days: MoodChart['days']
  min: number
  max: number
}) {
  const width = 320
  const height = 100
  const padding = 8
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const stepX = innerWidth / (days.length - 1)

  const pointFor = (score: number | null, i: number) => {
    const x = padding + i * stepX
    if (score == null) return { x, y: null as number | null }
    const pct = (score - min) / (max - min)
    const y = padding + innerHeight - pct * innerHeight
    return { x, y }
  }

  const points = days.map((d, i) => pointFor(d.score, i))

  // Build a path that lifts the pen at null points
  const d = (() => {
    let path = ''
    let penDown = false
    points.forEach((p) => {
      if (p.y == null) {
        penDown = false
        return
      }
      if (!penDown) {
        path += `M ${p.x.toFixed(2)} ${p.y.toFixed(2)} `
        penDown = true
      } else {
        path += `L ${p.x.toFixed(2)} ${p.y.toFixed(2)} `
      }
    })
    return path.trim()
  })()

  const area = (() => {
    const baseY = padding + innerHeight
    let path = ''
    let running = false
    let startX = 0
    points.forEach((p, i) => {
      if (p.y == null) {
        if (running) {
          path += `L ${points[i - 1].x.toFixed(2)} ${baseY} Z `
          running = false
        }
        return
      }
      if (!running) {
        startX = p.x
        path += `M ${startX.toFixed(2)} ${baseY} L ${p.x.toFixed(2)} ${p.y.toFixed(2)} `
        running = true
      } else {
        path += `L ${p.x.toFixed(2)} ${p.y.toFixed(2)} `
      }
    })
    if (running) {
      const last = points[points.length - 1]
      if (last.y != null) path += `L ${last.x.toFixed(2)} ${baseY} Z `
    }
    return path.trim()
  })()

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-24"
        role="img"
        aria-label="Gráfico de humor dos últimos 7 dias"
      >
        <defs>
          <linearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Baseline */}
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        {area && (
          <path
            d={area}
            fill="url(#moodArea)"
            className="text-teal-500"
          />
        )}
        {d && (
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-600 dark:text-teal-400"
          />
        )}
        {points.map((p, i) =>
          p.y == null ? (
            <circle
              key={i}
              cx={p.x}
              cy={height - padding}
              r="2"
              fill="currentColor"
              className="text-slate-300 dark:text-slate-700"
            />
          ) : (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="white"
              stroke="currentColor"
              strokeWidth="2"
              className="text-teal-600 dark:text-teal-400"
            />
          )
        )}
      </svg>
      <div className="mt-2 flex text-center">
        {days.map((d) => (
          <div key={d.dateISO} className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {d.label}
            </div>
            <div
              className={`text-xs tabular-nums font-semibold ${
                d.score == null
                  ? 'text-slate-300 dark:text-slate-600'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {d.score == null ? '—' : d.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
