import type { DispositivosStats } from '@/../product-mobile/sections/dispositivos/types'
import { Smartphone, Wifi, RefreshCw } from 'lucide-react'

interface StatsRowProps {
  stats: DispositivosStats
}

export function StatsRow({ stats }: StatsRowProps) {
  const conectadosColor = stats.conectados > 0 ? 'emerald' : 'slate'
  return (
    <div className="grid grid-cols-3 gap-2.5 px-4 mb-4">
      {/* Total */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Smartphone size={13} className="text-teal-400" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Total</span>
        </div>
        <div className="font-mono text-[24px] leading-none font-bold text-slate-50 tabular-nums">
          {stats.total}
        </div>
      </div>

      {/* Conectados */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Wifi size={13} className={`text-${conectadosColor}-400`} strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Conectados</span>
        </div>
        <div className={`font-mono text-[24px] leading-none font-bold tabular-nums ${stats.conectados > 0 ? 'text-emerald-300' : 'text-slate-300'}`}>
          {stats.conectados}
        </div>
      </div>

      {/* Última sync */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <RefreshCw size={13} className="text-sky-400" strokeWidth={2.2} />
          <span className="text-slate-400 text-[10.5px] font-medium">Sync</span>
        </div>
        <div className="font-mono text-[14px] leading-tight font-semibold text-slate-100 tabular-nums truncate">
          {stats.ultimaSyncRelativo}
        </div>
      </div>
    </div>
  )
}
