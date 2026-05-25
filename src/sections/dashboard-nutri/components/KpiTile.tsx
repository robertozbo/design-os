import { Lock, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { Kpi, PlanTier } from '@/../product/sections/dashboard-nutri/types'

interface KpiTileProps {
  kpi: Kpi
  currentPlan: PlanTier
}

const TREND_TONE: Record<Kpi['trend'], string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-orange-600 dark:text-orange-400',
  stable: 'text-slate-500 dark:text-slate-400',
}

const TREND_ICON: Record<Kpi['trend'], typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function KpiTile({ kpi, currentPlan }: KpiTileProps) {
  const locked = PLAN_RANK[currentPlan] < PLAN_RANK[kpi.planTierRequired]
  const TrendIcon = TREND_ICON[kpi.trend]

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
        locked
          ? 'border-dashed border-slate-300 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {kpi.label}
        </p>
        {locked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
            <Lock size={10} />
            {kpi.planTierRequired}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p
          className={`font-mono text-3xl font-semibold tabular-nums ${
            locked
              ? 'text-slate-400 blur-[2px] select-none dark:text-slate-600'
              : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          {kpi.value}
        </p>
        {!locked && (
          <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium ${TREND_TONE[kpi.trend]}`}>
            <TrendIcon size={12} />
            {kpi.trendDelta}
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        {locked ? `Disponível no plano ${kpi.planTierRequired}` : kpi.secondary}
      </p>

      {!locked && (
        <div className="absolute inset-x-5 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-teal-500 to-emerald-400 transition-transform duration-300 group-hover:scale-x-100" />
      )}
    </div>
  )
}
