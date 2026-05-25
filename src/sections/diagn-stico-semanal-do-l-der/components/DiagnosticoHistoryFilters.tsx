import type { HistoryPeriod } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Search, X } from 'lucide-react'

interface Props {
  activePeriod: HistoryPeriod
  onChangePeriod: (period: HistoryPeriod) => void
  search: string
  onChangeSearch: (value: string) => void
  totalCount: number
  filteredCount: number
}

const PERIODS: Array<{ id: HistoryPeriod; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'this-month', label: 'Este mês' },
  { id: 'last-quarter', label: 'Último trimestre' },
  { id: 'last-year', label: 'Últimos 12 meses' },
]

export function DiagnosticoHistoryFilters({
  activePeriod,
  onChangePeriod,
  search,
  onChangeSearch,
  totalCount,
  filteredCount,
}: Props) {
  const hasFilter = activePeriod !== 'all' || search.trim() !== ''
  const showingAll = filteredCount === totalCount

  return (
    <div
      style={{ animationDelay: '160ms' }}
      className="nymos-reveal opacity-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
    >
      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map((p) => {
          const active = activePeriod === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChangePeriod(p.id)}
              className={`
                inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition
                ${
                  active
                    ? 'bg-slate-900 dark:bg-teal-500 border-slate-900 dark:border-teal-500 text-white dark:text-slate-950 shadow-[0_8px_18px_-8px_rgba(15,23,42,0.4)]'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }
              `}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 tabular-nums whitespace-nowrap">
          {showingAll ? `${totalCount} registros` : `${filteredCount} de ${totalCount}`}
        </div>

        <div className="relative sm:max-w-xs sm:w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Buscar na observação ou ação"
            className="
              w-full pl-9 pr-9 py-2 rounded-xl
              bg-white/85 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition
            "
          />
          {search && (
            <button
              type="button"
              onClick={() => onChangeSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Limpar busca"
            >
              <X className="w-3 h-3" strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={() => {
            onChangePeriod('all')
            onChangeSearch('')
          }}
          className="lg:ml-3 self-start lg:self-auto text-[11px] font-medium text-teal-700 dark:text-teal-400 hover:underline whitespace-nowrap"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
