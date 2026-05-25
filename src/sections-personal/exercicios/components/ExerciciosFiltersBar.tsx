import { ChevronDown } from 'lucide-react'
import type {
  SortId,
  SortOption,
  SourceId,
  SourceOption,
} from '@/../product-personal/sections/exercicios/types'

interface ExerciciosFiltersBarProps {
  sources: SourceOption[]
  selectedSource: SourceId
  onSourceChange?: (id: SourceId) => void
  sortOptions: SortOption[]
  selectedSort: SortId
  onSortChange?: (id: SortId) => void
}

export function ExerciciosFiltersBar({
  sources,
  selectedSource,
  onSourceChange,
  sortOptions,
  selectedSort,
  onSortChange,
}: ExerciciosFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Source pills */}
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s) => {
          const active = selectedSource === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSourceChange?.(s.id)}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all
                ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                }
              `}
            >
              <span>{s.label}</span>
              <span
                className={`font-mono tabular-nums text-[10px] ${
                  active
                    ? 'text-white/70 dark:text-slate-900/70'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {s.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={selectedSort}
          onChange={(e) => onSortChange?.(e.target.value as SortId)}
          className="
            appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-medium text-slate-700
            focus:border-teal-400 focus:outline-none
            dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-teal-600
          "
        >
          {sortOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      </div>
    </div>
  )
}
