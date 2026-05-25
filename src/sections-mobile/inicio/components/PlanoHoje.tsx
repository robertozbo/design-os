import type { PlanoHoje as PlanoHojeType } from '@/../product-mobile/sections/inicio/types'
import { Utensils, ChevronRight, Clock } from 'lucide-react'

interface PlanoHojeProps {
  plano: PlanoHojeType
  onClick?: () => void
}

export function PlanoHoje({ plano, onClick }: PlanoHojeProps) {
  if (!plano.ativo || !plano.diet) return null

  const progressPct = Math.min(100, (plano.refeicoesRegistradas / plano.refeicoesTotal) * 100)
  const proxima = plano.proximaRefeicao
  const proximaMeal = proxima?.meal
  const nomePlano = plano.diet.name

  return (
    <button
      onClick={onClick}
      className="mx-4 mb-3 block w-[calc(100%-32px)] text-left rounded-2xl bg-teal-500/8 border border-teal-500/25 p-4 active:scale-[0.99] transition-transform"
      style={{ background: 'rgb(20 184 166 / 0.08)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
            <Utensils size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-slate-100 font-semibold text-[15px] truncate">Plano de Hoje</div>
            <div className="text-slate-400 text-[11.5px] truncate">
              por {plano.profissionalNome} · plano {nomePlano}
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-teal-300 shrink-0 mt-1" />
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-300 font-mono text-[12px] tabular-nums">
            {plano.refeicoesRegistradas} de {plano.refeicoesTotal} refeições
          </span>
          <span className="text-teal-300 font-mono text-[11px] tabular-nums">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-sky-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Próxima refeição */}
      {proximaMeal && (
        <div className="flex items-center gap-2 pt-2 border-t border-teal-500/10">
          <Clock size={13} className="text-teal-300 shrink-0" />
          <span className="text-slate-300 text-[12.5px]">
            Próximo: <span className="text-slate-100 font-medium">{proximaMeal.name.toLowerCase()}</span> ·{' '}
            <span className="font-mono tabular-nums">{proximaMeal.scheduledTime}</span>
          </span>
          <span className="ml-auto text-slate-500 font-mono text-[10.5px] tabular-nums">
            {proximaMeal.protein}P · {proximaMeal.carbohydrates}C · {proximaMeal.fat}G
          </span>
        </div>
      )}
    </button>
  )
}
