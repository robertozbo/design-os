import type { AtividadesStats } from '@/../product-mobile/sections/atividades/types'
import { Flame, Clock, Activity } from 'lucide-react'

interface StatsRowProps {
  stats: AtividadesStats
}

function formatMinutos(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5 px-4 mb-4">
      {/* Atividades */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Activity size={13} className={stats.quantidade > 0 ? 'text-emerald-400' : 'text-slate-500'} strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Atividades</span>
        </div>
        <div className="font-mono text-[24px] leading-none font-bold text-slate-50 tabular-nums">
          {stats.quantidade}
        </div>
      </div>

      {/* Calorias */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Flame size={13} className="text-rose-300" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Calorias</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-[20px] leading-none font-bold text-slate-50 tabular-nums">
            {stats.kcalTotal.toLocaleString('pt-BR')}
          </span>
          <span className="font-mono text-[10px] text-slate-400">kcal</span>
        </div>
      </div>

      {/* Tempo */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock size={13} className="text-violet-300" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Tempo</span>
        </div>
        <div className="font-mono text-[18px] leading-none font-semibold text-slate-50 tabular-nums">
          {formatMinutos(stats.minutosTotal)}
        </div>
      </div>
    </div>
  )
}
