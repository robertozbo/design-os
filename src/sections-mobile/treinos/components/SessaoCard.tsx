import { ChevronRight, Clock } from 'lucide-react'
import type { SessaoUI } from '@/../product-mobile/sections/treinos/types'
import { COR_BG, COR_TEXT, COR_BORDER } from './_shared'

interface SessaoCardProps {
  sessao: SessaoUI
  onClick?: (sessaoId: string) => void
}

export function SessaoCard({ sessao, onClick }: SessaoCardProps) {
  const bg = COR_BG[sessao.cor]
  const text = COR_TEXT[sessao.cor]
  const border = COR_BORDER[sessao.cor]
  const totalEx = sessao.session.exercises.length

  return (
    <button
      onClick={() => onClick?.(sessao.session.id)}
      className={`w-full bg-slate-900 border ${sessao.ehHoje ? border : 'border-slate-800'} hover:border-slate-700 rounded-2xl px-3.5 py-3 flex items-center gap-3 text-left`}
    >
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${text} font-bold text-[18px] font-mono tabular-nums shrink-0`}>
        {sessao.letra}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-slate-100 font-semibold text-[13px] truncate">{sessao.session.name}</span>
          {sessao.ehHoje && (
            <span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 text-[9px] font-semibold uppercase tracking-wider">
              Hoje
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-slate-500">
          {sessao.diaSemanaLabel && <span>{sessao.diaSemanaLabel}</span>}
          <span className="text-slate-700">·</span>
          <span className="font-mono tabular-nums">{totalEx} ex</span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-0.5 font-mono tabular-nums">
            <Clock size={9} />
            {sessao.duracaoEstimadaMin}min
          </span>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-600 shrink-0" />
    </button>
  )
}
