import type { MetricaDetalheStats } from '@/../product-mobile/sections/metricas/types'
import { formatNum } from '../_detalheData'

interface StatsRowProps {
  stats: MetricaDetalheStats
}

function StatCell({ label, value, unidade }: { label: string; value: number; unidade: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-center">
      <div className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">{label}</div>
      <div className="font-mono font-bold text-slate-50 text-[16px] tabular-nums leading-none mt-1">
        {formatNum(value)}
        {unidade && <span className="text-slate-400 text-[9px] font-medium ml-0.5">{unidade}</span>}
      </div>
    </div>
  )
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="px-4 flex gap-2">
      <StatCell label="Mín" value={stats.min} unidade={stats.unidade} />
      <StatCell label="Média" value={stats.media} unidade={stats.unidade} />
      <StatCell label="Máx" value={stats.max} unidade={stats.unidade} />
    </div>
  )
}
