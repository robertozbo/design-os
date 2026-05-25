import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { DimensionDiff } from '@/../product-mobile/sections/minha-saude/types'
import { DIMENSION_ICON, STATUS_VISUAL, statusFromScore } from './_shared'

interface DiffRowProps {
  diff: DimensionDiff
}

export function DiffRow({ diff }: DiffRowProps) {
  const Icon = DIMENSION_ICON[diff.dimensaoId]
  const semDados = diff.direcao === 'sem_dados'
  const visualFinal = STATUS_VISUAL[statusFromScore(diff.scoreFinal)]
  const visualInicial = STATUS_VISUAL[statusFromScore(diff.scoreInicial)]

  return (
    <div className={`rounded-2xl bg-slate-900 border ${semDados ? 'border-slate-800' : visualFinal.border} p-3.5`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${semDados ? 'bg-slate-800' : visualFinal.bg} flex items-center justify-center ${semDados ? 'text-slate-500' : visualFinal.text} shrink-0`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[12.5px]">{diff.label}</div>
          {semDados ? (
            <div className="text-slate-500 text-[10.5px] mt-0.5">Sem dados nos snapshots</div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[14px] font-mono tabular-nums font-semibold ${visualInicial.text}`}>
                {diff.scoreInicial}
              </span>
              <ArrowRight size={11} className="text-slate-600" strokeWidth={2.4} />
              <span className={`text-[14px] font-mono tabular-nums font-semibold ${visualFinal.text}`}>
                {diff.scoreFinal}
              </span>
            </div>
          )}
        </div>
        {!semDados && diff.delta !== null && <DeltaPill delta={diff.delta} />}
      </div>

      {!semDados && diff.metricas.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
          {diff.metricas.map((m) => (
            <div key={m.label} className="flex items-center gap-2 text-[11.5px]">
              <span className="text-slate-400 flex-1 truncate">{m.label}</span>
              <span className="text-slate-500 font-mono tabular-nums">{m.valorInicial}</span>
              <ArrowRight size={9} className="text-slate-700" />
              <span className="text-slate-100 font-mono tabular-nums font-semibold">{m.valorFinal}</span>
              {m.delta && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono tabular-nums font-semibold shrink-0 ${
                    m.delta.startsWith('+')
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : m.delta.startsWith('−') || m.delta.startsWith('-')
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.delta}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DeltaPill({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <div className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono tabular-nums font-semibold flex items-center gap-1 shrink-0">
        <Minus size={10} />0
      </div>
    )
  }
  const Icon = delta > 0 ? TrendingUp : TrendingDown
  const cls = delta > 0
    ? 'bg-emerald-500/15 text-emerald-300'
    : 'bg-rose-500/15 text-rose-300'
  return (
    <div className={`${cls} px-2 py-1 rounded-full text-[10.5px] font-mono tabular-nums font-bold flex items-center gap-1 shrink-0`}>
      <Icon size={10} strokeWidth={2.6} />
      {delta > 0 ? '+' : ''}
      {delta}
    </div>
  )
}
