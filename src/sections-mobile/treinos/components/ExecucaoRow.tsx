import { Clock, Flame, ChevronRight } from 'lucide-react'
import type { ExecucaoUI } from '@/../product-mobile/sections/treinos/types'
import { COR_BG, COR_TEXT } from './_shared'

interface ExecucaoRowProps {
  item: ExecucaoUI
  onClick?: (execucaoId: string) => void
}

export function ExecucaoRow({ item, onClick }: ExecucaoRowProps) {
  const bg = COR_BG[item.cor]
  const text = COR_TEXT[item.cor]
  const e = item.execucao

  return (
    <button
      onClick={() => onClick?.(e.id)}
      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 flex items-center gap-3 text-left"
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${text} font-bold text-[14px] font-mono tabular-nums shrink-0`}>
        {e.session.sessionLetter}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-100 font-semibold text-[12.5px] truncate">{e.session.name}</span>
          <span className="text-slate-600 text-[10px] font-mono tabular-nums shrink-0">· {item.tempoRelativo}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-slate-500 font-mono tabular-nums">
          <span className="flex items-center gap-0.5">
            <Clock size={9} />
            {e.durationMinutes}min
          </span>
          <span className="text-slate-700">·</span>
          <span className="flex items-center gap-0.5">
            <Flame size={9} />
            {e.caloriesBurned} kcal
          </span>
          {e.rating !== null && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-amber-300">{item.ratingLabel}</span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}
