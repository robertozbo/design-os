import type { CategoriaPill, CategoriaUI } from '@/../product-mobile/sections/atividades/types'

interface CategoriaPillsProps {
  pills: CategoriaPill[]
  selected: CategoriaUI[]
  onChange?: (categorias: CategoriaUI[]) => void
}

export function CategoriaPills({ pills, selected, onChange }: CategoriaPillsProps) {
  function toggle(id: CategoriaPill['id']) {
    if (id === 'todas') {
      onChange?.([])
      return
    }
    const isSel = selected.includes(id)
    if (isSel) {
      onChange?.(selected.filter((c) => c !== id))
    } else {
      onChange?.([...selected, id])
    }
  }

  return (
    <div className="px-4 mb-4 flex gap-1.5 overflow-x-auto no-scrollbar">
      {pills.map((p) => {
        const active =
          p.id === 'todas' ? selected.length === 0 : selected.includes(p.id as CategoriaUI)
        return (
          <button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11.5px] font-medium transition-colors border ${
              active
                ? 'bg-teal-500/15 border-teal-500/60 text-teal-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
            {p.count > 0 && (
              <span
                className={`font-mono tabular-nums text-[9.5px] ${
                  active ? 'opacity-90' : 'opacity-60'
                }`}
              >
                {p.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
