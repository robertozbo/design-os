import { useState } from 'react'
import { Search } from 'lucide-react'
import type { FilterChip } from '@/../product/sections/professional-dashboard/types'

interface Props {
  chips: FilterChip[]
  activeFilterId: string
  totalFilteredCount: number
  onFilterChange?: (filterId: string) => void
  onSearchChange?: (query: string) => void
  revealIndex?: number
}

export function FilterBar({
  chips,
  activeFilterId,
  totalFilteredCount,
  onFilterChange,
  onSearchChange,
  revealIndex = 0,
}: Props) {
  const [query, setQuery] = useState('')
  return (
    <div
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        flex flex-col md:flex-row md:items-center md:justify-between gap-3
      "
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {chips.map((chip) => {
          const active = chip.id === activeFilterId
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onFilterChange?.(chip.id)}
              aria-pressed={active}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-medium transition-colors
                ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
                }
              `}
            >
              <span>{chip.label}</span>
              <span
                className={`
                  text-[10px] font-semibold tabular-nums rounded-full px-1.5 py-0.5
                  ${
                    active
                      ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }
                `}
              >
                {chip.count}
              </span>
            </button>
          )
        })}
        <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          Mostrando {totalFilteredCount} paciente{totalFilteredCount === 1 ? '' : 's'}
        </span>
      </div>

      <div className="relative md:w-72">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500"
        />
        <input
          type="search"
          placeholder="Buscar paciente por nome"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            onSearchChange?.(e.target.value)
          }}
          className="
            w-full pl-9 pr-3 py-2
            rounded-lg text-sm
            bg-white dark:bg-slate-900/80
            border border-slate-200 dark:border-slate-800
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400
            transition-colors
          "
        />
      </div>
    </div>
  )
}
