import { Target, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import type {
  DashboardGoals,
  GoalStatus,
} from '@/../product/sections/dashboard/types'

export interface GoalsCardProps {
  goals: DashboardGoals
  revealIndex?: number
  onNavigate?: () => void
}

const STATUS_BAR_COLOR: Record<GoalStatus, string> = {
  'on-track': 'rgb(16, 185, 129)',
  'at-risk': 'rgb(245, 158, 11)',
  achieved: 'rgb(20, 184, 166)',
}

export function GoalsCard({ goals, revealIndex = 0, onNavigate }: GoalsCardProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group flex flex-col text-left h-full
        rounded-2xl p-5
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
      "
    >
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Objetivos
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Metas ativas
          </h3>
          <p className="mt-0.5 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>{goals.activeCount} ativas</span>
            {goals.achievedThisMonth > 0 && (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                {goals.achievedThisMonth} no mês
              </span>
            )}
          </p>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </header>

      <ul className="flex-1 flex flex-col gap-3">
        {goals.items.slice(0, 4).map((g) => {
          const barColor = STATUS_BAR_COLOR[g.status]
          const pct = Math.min(Math.max(g.progress, 0), 100)
          return (
            <li key={g.id} className="min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                  {g.label}
                </span>
                <span className="shrink-0 font-mono tabular-nums text-[10px] text-slate-500 dark:text-slate-400">
                  {g.current} / {g.target} {g.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: barColor }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </button>
  )
}
