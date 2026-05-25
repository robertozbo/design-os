import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { DeltaTone, Kpi } from '@/../product/sections/professional-dashboard/types'

const toneClass: Record<DeltaTone, string> = {
  good: 'text-teal-600 dark:text-teal-400',
  neutral: 'text-slate-500 dark:text-slate-400',
  warning: 'text-amber-600 dark:text-amber-400',
  critical: 'text-rose-600 dark:text-rose-400',
}

function iconFor(tone: DeltaTone, delta: string) {
  if (tone === 'neutral') return Minus
  const negative = delta.trim().startsWith('−') || delta.trim().startsWith('-')
  // For a "good" tone, direction indicator should match the number prefix.
  if (tone === 'good') return negative ? TrendingDown : TrendingUp
  return negative ? TrendingDown : TrendingUp
}

export function KpiCard({ kpi, revealIndex = 0 }: { kpi: Kpi; revealIndex?: number }) {
  const Icon = iconFor(kpi.deltaTone, kpi.delta)
  return (
    <div
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        px-5 py-4
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
      "
    >
      <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
        {kpi.label}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
          {kpi.value.toLocaleString('pt-BR')}
        </span>
        {kpi.unit && (
          <span className="text-sm text-slate-500 dark:text-slate-400">{kpi.unit}</span>
        )}
      </div>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${toneClass[kpi.deltaTone]}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{kpi.delta}</span>
      </div>
    </div>
  )
}
