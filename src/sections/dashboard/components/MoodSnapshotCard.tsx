import { Smile, ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type {
  DashboardMood,
  MoodIntensity,
  TrendDirection,
} from '@/../product/sections/dashboard/types'

export interface MoodSnapshotCardProps {
  mood: DashboardMood
  revealIndex?: number
  onCheckIn?: () => void
  onNavigate?: () => void
}

const INTENSITY_COLOR: Record<MoodIntensity, string> = {
  low: 'rgb(244, 63, 94)',
  neutral: 'rgb(245, 158, 11)',
  good: 'rgb(139, 92, 246)',
}

function trendIcon(dir: TrendDirection) {
  if (dir === 'up') return TrendingUp
  if (dir === 'down') return TrendingDown
  return Minus
}

export function MoodSnapshotCard({
  mood,
  revealIndex = 0,
  onCheckIn,
  onNavigate,
}: MoodSnapshotCardProps) {
  const TrendIcon = trendIcon(mood.trendDirection)
  const deltaSign = mood.trendDelta > 0 ? '+' : ''

  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        relative flex flex-col h-full
        rounded-2xl p-5
        bg-gradient-to-br from-violet-50 via-white to-violet-50/40
        dark:from-violet-500/10 dark:via-slate-900/80 dark:to-violet-500/5
        border border-violet-500/20 dark:border-violet-400/20
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Saúde mental
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Smile className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            Humor
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Última semana
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

      <div className="flex-1 flex flex-col gap-4">
        <div>
          {mood.checkedInToday && mood.currentValue !== null ? (
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 leading-none">
                {mood.currentValue}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ 10</span>
            </div>
          ) : (
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              Ainda não fez check-in
            </div>
          )}

          <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono tabular-nums">Média · {mood.avg7d.toFixed(1)}</span>
            <span
              className={`inline-flex items-center gap-0.5 font-mono tabular-nums ${
                mood.trendDirection === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : mood.trendDirection === 'down'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <TrendIcon className="w-3 h-3" />
              {deltaSign}
              {mood.trendDelta.toFixed(1)}
            </span>
          </div>
        </div>

        {!mood.checkedInToday && (
          <button
            type="button"
            onClick={onCheckIn}
            className="
              self-start inline-flex items-center gap-1.5
              px-4 py-2 rounded-full
              bg-violet-600 hover:bg-violet-700 text-white
              dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-slate-950
              text-xs font-medium shadow-sm
              transition-colors
            "
          >
            <Smile className="w-3.5 h-3.5" />
            Fazer check-in
          </button>
        )}

        <div className="mt-auto">
          <div className="flex items-end justify-between gap-1.5">
            {mood.last7Days.map((d, i) => {
              const hasValue = d.value !== null && d.intensity !== null
              const color = hasValue
                ? INTENSITY_COLOR[d.intensity as MoodIntensity]
                : undefined
              const heightPct = hasValue ? Math.max((d.value as number) / 10, 0.2) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="relative w-full h-16 flex items-end">
                    {hasValue ? (
                      <div
                        className="w-full rounded-full mx-auto"
                        style={{
                          height: `${heightPct}%`,
                          background: color,
                          maxWidth: '8px',
                          marginInline: 'auto',
                        }}
                      />
                    ) : (
                      <div className="w-2 h-2 mx-auto rounded-full bg-slate-200 dark:bg-slate-700" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {d.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
