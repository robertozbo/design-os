import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import type { MonthlyMoodTrend } from '@/../product/sections/mental-health/types'
import { CardShell } from './CardShell'

interface Props {
  trend: MonthlyMoodTrend
  revealIndex?: number
}

export function MonthlyTrendCard({ trend, revealIndex = 0 }: Props) {
  const up = trend.direction === 'up'
  const flat = trend.direction === 'flat'
  const Icon = flat ? ArrowRight : up ? TrendingUp : TrendingDown
  const tone = flat
    ? 'text-slate-500 dark:text-slate-400'
    : up
    ? 'text-teal-600 dark:text-teal-400'
    : 'text-violet-600 dark:text-violet-400'

  // Simple two-bar comparison
  const max = 10
  const prevPct = (trend.previousAverageMood / max) * 100
  const currPct = (trend.averageMood / max) * 100

  return (
    <CardShell
      eyebrow="Tendência"
      title="Humor mensal"
      meta={`${trend.previousMonthLabel} → ${trend.monthLabel}`}
      accent="violet"
      revealIndex={revealIndex}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {trend.averageMood.toFixed(1)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          média de {trend.monthLabel.toLowerCase()}
        </span>
      </div>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${tone}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{trend.deltaLabel}</span>
      </div>

      <div className="mt-5 space-y-3">
        <TrendRow
          label={trend.previousMonthLabel}
          value={trend.previousAverageMood}
          pct={prevPct}
          muted
        />
        <TrendRow
          label={trend.monthLabel}
          value={trend.averageMood}
          pct={currPct}
        />
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {trend.summary}
      </p>
    </CardShell>
  )
}

function TrendRow({
  label,
  value,
  pct,
  muted = false,
}: {
  label: string
  value: number
  pct: number
  muted?: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-[11px] font-medium ${
            muted
              ? 'text-slate-500 dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-200'
          }`}
        >
          {label}
        </span>
        <span
          className={`text-xs font-semibold tabular-nums ${
            muted
              ? 'text-slate-500 dark:text-slate-500'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            muted ? 'bg-slate-400/60 dark:bg-slate-500/60' : 'bg-violet-500'
          }`}
          style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  )
}
