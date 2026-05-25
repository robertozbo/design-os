import {
  HeartPulse,
  Footprints,
  Moon,
  Waves,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import type {
  DashboardHeroStats,
  HeroStatValue,
  TrendDirection,
  TrendSentiment,
} from '@/../product/sections/dashboard/types'

export interface VitalMetricsCardProps {
  stats: DashboardHeroStats
  /** Optional HRV field via heroStats — fallback to a static value to mirror screenshot */
  hrvValue?: number
  revealIndex?: number
  onNavigate?: () => void
}

interface TileCfg {
  label: string
  icon: LucideIcon
  format: (v: number) => string
  unit: string
}

const TILES: { key: keyof DashboardHeroStats; cfg: TileCfg }[] = [
  {
    key: 'heartRate',
    cfg: {
      label: 'FC Repouso',
      icon: HeartPulse,
      format: (v) => Math.round(v).toString(),
      unit: 'bpm',
    },
  },
  {
    key: 'sleepHours',
    cfg: {
      label: 'Sono',
      icon: Moon,
      format: (v) => {
        const h = Math.floor(v)
        const m = Math.round((v - h) * 60)
        return m === 0 ? `${h}h` : `${h}h ${m}m`
      },
      unit: '',
    },
  },
  {
    key: 'steps',
    cfg: {
      label: 'Passos',
      icon: Footprints,
      format: (v) => Math.round(v).toLocaleString('pt-BR'),
      unit: '',
    },
  },
]

function trendIcon(dir: TrendDirection): LucideIcon {
  if (dir === 'up') return TrendingUp
  if (dir === 'down') return TrendingDown
  return Minus
}

function trendColor(sentiment: TrendSentiment): string {
  if (sentiment === 'positive') return 'text-teal-600 dark:text-teal-400'
  if (sentiment === 'negative') return 'text-rose-600 dark:text-rose-400'
  return 'text-slate-500 dark:text-slate-400'
}

function MetricTile({
  label,
  value,
  unit,
  trend,
}: {
  label: string
  value: string
  unit: string
  trend?: HeroStatValue['trend']
}) {
  const TrendIcon = trend ? trendIcon(trend.direction) : null
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <div className="font-mono text-2xl font-semibold leading-none tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </div>
        {unit && (
          <div className="text-xs text-slate-500 dark:text-slate-400">{unit}</div>
        )}
      </div>
      {trend && TrendIcon && (
        <div
          className={`mt-1.5 flex items-center gap-1 text-[10px] ${trendColor(
            trend.sentiment,
          )}`}
        >
          <TrendIcon className="w-3 h-3 shrink-0" />
          <span className="truncate">{trend.label}</span>
        </div>
      )}
    </div>
  )
}

export function VitalMetricsCard({
  stats,
  hrvValue = 48,
  revealIndex = 0,
  onNavigate,
}: VitalMetricsCardProps) {
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative flex flex-col h-full
        rounded-2xl p-5
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <header className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Wearables
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Sinais vitais
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Hoje vs média semanal
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Ver detalhe"
            className="
              shrink-0 grid place-items-center w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </header>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5 flex-1">
        {TILES.map(({ key, cfg }) => {
          const v = stats[key]
          const displayValue =
            v.available && v.value !== null ? cfg.format(v.value) : '--'
          return (
            <MetricTile
              key={key}
              label={cfg.label}
              value={displayValue}
              unit={cfg.unit}
              trend={v.trend}
            />
          )
        })}
        <MetricTile
          label="HRV"
          value={String(hrvValue)}
          unit="ms"
          trend={{
            label: 'Em linha com a média',
            direction: 'stable',
            sentiment: 'neutral',
          }}
        />
      </div>
    </section>
  )
}
