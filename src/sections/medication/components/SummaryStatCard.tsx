import type { ComponentType } from 'react'
import {
  Activity,
  CalendarClock,
  CheckCheck,
  Minus,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { Sparkline } from './Sparkline'

export interface SummaryStatCardProps {
  icon: 'check' | 'activity' | 'clock'
  label: string
  value: string
  unit?: string
  trendPercent?: number
  series?: number[]
  summary?: { label: string; value: string; unit?: string }
  revealIndex?: number
}

const ICONS: Record<SummaryStatCardProps['icon'], LucideIcon> = {
  check: CheckCheck,
  activity: Activity,
  clock: CalendarClock,
}

function pickAccent(trend?: number): 'teal' | 'emerald' | 'coral' | 'slate' {
  if (trend === undefined) return 'emerald'
  if (trend > 1) return 'teal'
  if (trend < -1) return 'coral'
  return 'emerald'
}

function trendChip(trend?: number) {
  if (trend === undefined) return null
  const cls =
    trend > 1
      ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10'
      : trend < -1
        ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10'
        : 'text-slate-500 dark:text-slate-400 bg-slate-500/10 dark:bg-slate-400/10'
  const Icon = trend > 1 ? TrendingUp : trend < -1 ? TrendingDown : Minus
  const sign = trend > 0 ? '+' : trend < 0 ? '−' : ''
  return (
    <div
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium ${cls}`}
    >
      <Icon className="h-2.5 w-2.5" />
      {trend === 0 ? '0%' : `${sign}${Math.abs(trend).toFixed(1)}%`}
    </div>
  )
}

export function SummaryStatCard({
  icon,
  label,
  value,
  unit,
  trendPercent,
  series,
  summary,
  revealIndex = 0,
}: SummaryStatCardProps) {
  const Icon: ComponentType<{ className?: string }> = ICONS[icon]
  const accent = pickAccent(trendPercent)
  const accentBg =
    accent === 'teal'
      ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300'
      : accent === 'coral'
        ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300'
        : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="nymos-reveal flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 opacity-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-[2px] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]"
    >
      <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${accentBg}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              {label}
            </h3>
            <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Resumo
            </div>
          </div>
        </div>
        {trendChip(trendPercent)}
      </header>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1">
            <div className="font-mono text-[22px] font-semibold leading-none tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
              {value}
            </div>
            {unit && (
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{unit}</div>
            )}
          </div>
          {summary && (
            <div className="shrink-0 text-right leading-tight">
              <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {summary.label}
              </div>
              <div className="font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-400">
                {summary.value}
                {summary.unit && (
                  <span className="ml-0.5 text-[9px] text-slate-500 dark:text-slate-500">
                    {summary.unit}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {series && series.length > 1 ? (
          <Sparkline series={series} accent={accent} height={32} />
        ) : (
          <div
            className="w-full rounded-md bg-slate-100/60 dark:bg-slate-800/40"
            style={{ height: 32 }}
          />
        )}
      </div>
    </section>
  )
}
