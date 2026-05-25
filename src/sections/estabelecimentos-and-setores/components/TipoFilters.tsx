import type {
  Estabelecimento,
  FiltroTipoEstab,
} from '@/../product/sections/estabelecimentos-and-setores/types'

interface TipoFiltersProps {
  ativo: FiltroTipoEstab
  estabelecimentos: Estabelecimento[]
  onChange?: (tipo: FiltroTipoEstab) => void
}

interface TabSpec {
  value: FiltroTipoEstab
  label: string
  count: number
}

export function TipoFilters({ ativo, estabelecimentos, onChange }: TipoFiltersProps) {
  const matrizes = estabelecimentos.filter((e) => e.tipo === 'matriz').length
  const filiais = estabelecimentos.filter((e) => e.tipo === 'filial').length

  const tabs: TabSpec[] = [
    { value: 'todos', label: 'Todos', count: estabelecimentos.length },
    { value: 'matriz', label: 'Matriz', count: matrizes },
    { value: 'filial', label: 'Filiais', count: filiais },
  ]

  return (
    <div
      role="tablist"
      aria-label="Filtrar por tipo"
      className="
        inline-flex p-1 rounded-xl
        bg-slate-100/80 dark:bg-slate-900/60
        ring-1 ring-slate-200/60 dark:ring-slate-800
      "
    >
      {tabs.map((tab) => {
        const isActive = ativo === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.value)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
              text-sm font-medium
              transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            <span>{tab.label}</span>
            <span
              className={`
                inline-flex items-center justify-center min-w-[22px] px-1.5
                rounded-md text-[10px] font-mono tabular-nums
                ${
                  isActive
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
