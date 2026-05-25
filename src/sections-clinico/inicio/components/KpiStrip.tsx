import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Kpi } from '@/../product-clinico/sections/inicio/types'
import { Sparkline } from './Sparkline'

interface Props {
  kpis: Kpi[]
  onAbrirKpi?: (id: string) => void
}

export function KpiStrip({ kpis, onAbrirKpi }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((k) => (
        <button
          key={k.id}
          onClick={() => onAbrirKpi?.(k.id)}
          className="
            group/kpi rounded-xl border border-slate-200/80 bg-white p-4 text-left shadow-sm
            transition-all hover:border-teal-300 hover:shadow
            focus:outline-none focus:ring-2 focus:ring-teal-500/40
            dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {k.label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
            {k.valor}
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <span
              className={`
                inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums
                ${
                  k.deltaPositivo
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }
              `}
            >
              {k.deltaPositivo ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {k.delta}
            </span>
            <Sparkline values={k.historico} positive={k.deltaPositivo} />
          </div>
        </button>
      ))}
    </div>
  )
}
