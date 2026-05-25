import type { FiltroOpcao, FiltroStatus } from '@/../product-mobile/sections/dispositivos/types'

interface FilterPillsProps {
  filtros: FiltroOpcao[]
  selected: FiltroStatus
  onChange?: (id: FiltroStatus) => void
}

export function FilterPills({ filtros, selected, onChange }: FilterPillsProps) {
  return (
    <div className="px-4 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
      {filtros.map((f) => {
        const active = f.id === selected
        return (
          <button
            key={f.id}
            onClick={() => onChange?.(f.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
              active
                ? 'bg-teal-500 text-white'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {f.label}
            <span className={`font-mono tabular-nums text-[10.5px] ${active ? 'opacity-90' : 'opacity-60'}`}>
              {f.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
