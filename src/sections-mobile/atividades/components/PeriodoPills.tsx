import type { Periodo, PeriodoOpcao } from '@/../product-mobile/sections/atividades/types'

interface PeriodoPillsProps {
  periodos: PeriodoOpcao[]
  selected: Periodo
  onChange?: (id: Periodo) => void
}

export function PeriodoPills({ periodos, selected, onChange }: PeriodoPillsProps) {
  return (
    <div className="px-4 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
      {periodos.map((p) => {
        const active = p.id === selected
        return (
          <button
            key={p.id}
            onClick={() => onChange?.(p.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
              active
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
