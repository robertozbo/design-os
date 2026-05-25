import type { ObjetivosStats } from '@/../product-mobile/sections/objetivos/types'
import { Activity, TrendingUp, Trophy } from 'lucide-react'

interface StatsRowProps {
  stats: ObjetivosStats
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 px-4 mb-4">
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Activity size={13} className="text-emerald-400" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Ativos</span>
        </div>
        <div className="font-mono text-[24px] leading-none font-bold text-slate-50 tabular-nums">
          {stats.ativos}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TrendingUp size={13} className="text-teal-300" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Progresso</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-[24px] leading-none font-bold text-slate-50 tabular-nums">
            {stats.progressoMedio}
          </span>
          <span className="font-mono text-[11px] text-slate-400">%</span>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Trophy size={13} className="text-amber-300" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Feitos</span>
        </div>
        <div className="font-mono text-[24px] leading-none font-bold text-slate-50 tabular-nums">
          {stats.concluidos}
        </div>
      </div>
    </div>
  )
}
