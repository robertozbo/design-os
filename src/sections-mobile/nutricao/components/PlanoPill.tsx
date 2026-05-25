import type { PlanoHojePill } from '@/../product-mobile/sections/nutricao/types'
import { Utensils, ChevronRight } from 'lucide-react'

interface PlanoPillProps {
  plano: PlanoHojePill
  onClick?: () => void
}

export function PlanoPill({ plano, onClick }: PlanoPillProps) {
  if (!plano.ativo || !plano.diet) return null
  return (
    <button
      onClick={onClick}
      className="w-[calc(100%-32px)] mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-teal-500/8 border border-teal-500/25 border-l-[3px] border-l-teal-500 px-3 py-2.5 text-left active:scale-[0.99] transition-transform"
    >
      <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
        <Utensils size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[13.5px] truncate">
          Plano {plano.diet.name}
        </div>
        <div className="text-slate-400 text-[11.5px] truncate">
          por {plano.profissionalNome}
        </div>
      </div>
      <ChevronRight size={16} className="text-teal-300 shrink-0" />
    </button>
  )
}
