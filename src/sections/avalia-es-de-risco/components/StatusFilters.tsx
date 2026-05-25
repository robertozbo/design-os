import type { StatusFiltro, AvaliacoesKpis } from '@/../product/sections/avalia-es-de-risco/types'

interface StatusFiltersProps {
  ativo: StatusFiltro
  kpis: AvaliacoesKpis
  onChange?: (status: StatusFiltro) => void
}

const FILTERS: { id: StatusFiltro; label: string; countKey: keyof AvaliacoesKpis }[] = [
  { id: 'todos', label: 'Todos', countKey: 'totalCriadas' },
  { id: 'rascunho', label: 'Rascunho', countKey: 'emRascunho' },
  { id: 'em_aplicacao', label: 'Em aplicação', countKey: 'emAplicacao' },
  { id: 'encerrada', label: 'Encerradas', countKey: 'encerradas' },
  { id: 'publicada', label: 'Publicadas', countKey: 'publicadas' },
]

export function StatusFilters({ ativo, kpis, onChange }: StatusFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {FILTERS.map((filter) => {
        const isActive = ativo === filter.id
        const count = kpis[filter.countKey]
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange?.(filter.id)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
              transition-colors duration-150
              ${isActive
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-white/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-white dark:hover:bg-slate-800'
              }
            `}
          >
            {filter.label}
            <span
              className={`
                tabular-nums text-[10px] font-mono px-1.5 py-px rounded-full
                ${isActive
                  ? 'bg-white/20 text-white dark:bg-slate-900/30 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
