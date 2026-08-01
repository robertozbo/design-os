import type { SeriePonto } from '@/../product-mobile/sections/metricas/types'
import { formatNum } from '../_detalheData'

interface HistoricoListProps {
  serie: SeriePonto[]
  unidade: string
  /** Máximo de leituras exibidas (mais recentes primeiro). */
  max?: number
}

export function HistoricoList({ serie, unidade, max = 12 }: HistoricoListProps) {
  // mais recente primeiro
  const ordenado = [...serie].reverse()
  const visiveis = ordenado.slice(0, max)
  const restantes = ordenado.length - visiveis.length

  return (
    <div className="px-4">
      <div className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide mb-2">
        Histórico
      </div>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/70 overflow-hidden">
        {visiveis.map((p, i) => (
          <div key={`${p.t}-${i}`} className="flex items-center gap-3 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="text-slate-200 text-[13px] font-medium">{p.rotulo}</div>
              {p.fonte && (
                <div className="text-slate-500 font-mono text-[10px] truncate">{p.fonte}</div>
              )}
            </div>
            <div className="font-mono font-bold text-slate-50 text-[14px] tabular-nums shrink-0">
              {formatNum(p.v)}
              {unidade && <span className="text-slate-400 text-[10px] font-medium ml-0.5">{unidade}</span>}
            </div>
          </div>
        ))}
      </div>
      {restantes > 0 && (
        <div className="text-slate-500 text-[11px] font-mono text-center mt-2">
          + {restantes} leituras anteriores
        </div>
      )}
    </div>
  )
}
