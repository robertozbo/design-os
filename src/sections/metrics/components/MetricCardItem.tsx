import {
  Heart,
  HeartPulse,
  Moon,
  Footprints,
  Activity,
  Waves,
  Scale,
  Droplet,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Smartphone,
} from 'lucide-react'
import type { ComponentType } from 'react'
import type {
  MetricCard,
  MetricType,
} from '@/../product/sections/metrics/types'
import { Sparkline } from './Sparkline'

export interface MetricCardItemProps {
  metric: MetricCard
  revealIndex?: number
  onRegister?: (metricType: MetricType) => void
  onConnect?: (metricType: MetricType) => void
  onSelect?: (metricId: string) => void
}

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  heart: Heart,
  'heart-pulse': HeartPulse,
  moon: Moon,
  footprints: Footprints,
  activity: Activity,
  waveform: Waves,
  scale: Scale,
  droplet: Droplet,
}

function pickAccent(sentiment: 'positive' | 'negative' | 'neutral' | null): 'teal' | 'emerald' | 'coral' | 'slate' {
  if (sentiment === 'positive') return 'teal'
  if (sentiment === 'negative') return 'coral'
  if (sentiment === 'neutral') return 'emerald'
  return 'slate'
}

function trendClasses(sentiment: 'positive' | 'negative' | 'neutral') {
  if (sentiment === 'positive') return 'text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10'
  if (sentiment === 'negative') return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10'
  return 'text-slate-500 dark:text-slate-400 bg-slate-500/10 dark:bg-slate-400/10'
}

function formatLastUpdated(iso: string | null): string {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'agora'
    if (diffMin < 60) return `${diffMin}min atrás`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `${diffH}h atrás`
    const diffD = Math.floor(diffH / 24)
    if (diffD < 7) return `${diffD}d atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

export function MetricCardItem({
  metric,
  revealIndex = 0,
  onRegister,
  onConnect,
  onSelect,
}: MetricCardItemProps) {
  const Icon = ICONS[metric.icon] ?? Activity
  const isEmpty = metric.currentValue === null
  const accent = pickAccent(metric.trend?.sentiment ?? null)

  const TrendIcon =
    metric.trend?.direction === 'up'
      ? TrendingUp
      : metric.trend?.direction === 'down'
        ? TrendingDown
        : Minus

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group relative flex flex-col
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-0.5
        hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_16px_40px_-16px_rgba(15,23,42,0.18)]
        dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_20px_48px_-20px_rgba(0,0,0,0.7)]
      "
    >
      <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => onSelect?.(metric.id)}
          className="flex items-center gap-2 min-w-0 text-left"
        >
          <div
            className={`
              shrink-0 grid place-items-center w-7 h-7 rounded-lg
              ${
                accent === 'teal'
                  ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300'
                  : accent === 'coral'
                    ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300'
                    : accent === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
                      : 'bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-tight truncate">
              {metric.name}
            </h3>
            {metric.source && (
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                {metric.sourceType === 'device' ? (
                  <Smartphone className="w-2 h-2 shrink-0" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                )}
                <span className="truncate">{metric.source}</span>
              </div>
            )}
          </div>
        </button>

        {metric.trend && (
          <div
            className={`
              shrink-0 inline-flex items-center gap-0.5
              px-1.5 py-0.5 rounded-full
              text-[10px] font-mono font-medium
              ${trendClasses(metric.trend.sentiment)}
            `}
          >
            <TrendIcon className="w-2.5 h-2.5" />
            {metric.trend.direction === 'flat'
              ? '0%'
              : `${metric.trend.direction === 'down' ? '−' : '+'}${Math.abs(metric.trend.percent).toFixed(1)}%`}
          </div>
        )}
      </header>

      <div className="px-4 pb-3 flex-1 flex flex-col gap-2">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-3 gap-2 min-h-[88px]">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] leading-snug">
              {metric.emptyHint ?? 'Sem dados ainda neste período.'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {metric.allowManualEntry && (
                <button
                  type="button"
                  onClick={() => onRegister?.(metric.type)}
                  className="
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-full
                    bg-teal-600 hover:bg-teal-700 text-white
                    dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                    text-[11px] font-medium
                    transition-colors
                  "
                >
                  <Plus className="w-3 h-3" />
                  Registrar
                </button>
              )}
              {metric.sourceType === 'device' && (
                <button
                  type="button"
                  onClick={() => onConnect?.(metric.type)}
                  className="
                    inline-flex items-center
                    px-2.5 py-1 rounded-full
                    border border-slate-200 dark:border-slate-700
                    text-slate-700 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-800
                    text-[11px] font-medium
                    transition-colors
                  "
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-1 min-w-0">
                <div className="font-mono text-[22px] font-semibold text-slate-900 dark:text-slate-50 leading-none tracking-tight tabular-nums">
                  {metric.currentValue}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{metric.unit}</div>
              </div>
              {metric.summary && (
                <div className="text-right shrink-0 leading-tight">
                  <div className="text-[9px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400">
                    {metric.summary.label}
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
                    {metric.summary.value}
                    <span className="ml-0.5 text-[9px] text-slate-500 dark:text-slate-500">
                      {metric.summary.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Sparkline series={metric.series} accent={accent} height={32} />

            <div className="flex items-center justify-between -mb-1">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {formatLastUpdated(metric.lastUpdatedAt)}
              </div>
              {metric.allowManualEntry && (
                <button
                  type="button"
                  onClick={() => onRegister?.(metric.type)}
                  className="
                    inline-flex items-center gap-0.5
                    px-2 py-0.5 rounded-full
                    text-[10px] font-medium
                    text-teal-700 dark:text-teal-300
                    hover:bg-teal-500/10 dark:hover:bg-teal-400/10
                    transition-colors
                  "
                >
                  <Plus className="w-2.5 h-2.5" />
                  Registrar
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
