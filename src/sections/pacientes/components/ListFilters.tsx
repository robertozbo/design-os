import { ArrowDownUp } from 'lucide-react'
import type { FilterId, ListFilter, ListSort, SortId } from '@/../product/sections/pacientes/types'

interface ListFiltersProps {
  filters: ListFilter[]
  selectedFilter: FilterId
  sorts: ListSort[]
  selectedSort: SortId
  onFilterChange?: (filter: FilterId) => void
  onSortChange?: (sort: SortId) => void
}

export function ListFilters({
  filters,
  selectedFilter,
  sorts,
  selectedSort,
  onFilterChange,
  onSortChange,
}: ListFiltersProps) {
  const currentSortLabel = sorts.find((s) => s.id === selectedSort)?.label ?? 'Ordenar'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter pills with horizontal scroll on mobile */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1.5 sm:flex-wrap sm:overflow-visible sm:py-0">
        {filters.map((filter) => {
          const active = filter.id === selectedFilter
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange?.(filter.id)}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {filter.label}
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  active
                    ? 'text-slate-300 dark:text-slate-500'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {filter.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Sort dropdown */}
      <div className="relative inline-flex shrink-0">
        <select
          value={selectedSort}
          onChange={(e) => onSortChange?.(e.target.value as SortId)}
          className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-sm font-medium text-slate-700 ring-0 focus:border-teal-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-teal-600"
          aria-label="Ordenar lista"
        >
          {sorts.map((sort) => (
            <option key={sort.id} value={sort.id}>
              {sort.label}
            </option>
          ))}
        </select>
        <ArrowDownUp
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          ▾
        </span>
        <span className="sr-only">{currentSortLabel}</span>
      </div>
    </div>
  )
}
