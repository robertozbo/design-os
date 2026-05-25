import { Search, LayoutGrid, List } from 'lucide-react'
import type { ActivityView } from '@/../product/sections/activities/types'

export interface ControlsBarProps {
  query: string
  view: ActivityView
  onQueryChange: (value: string) => void
  onViewChange: (view: ActivityView) => void
}

export function ControlsBar({ query, view, onQueryChange, onViewChange }: ControlsBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar atividade…"
          className="
            w-full pl-9 pr-3 py-2.5
            rounded-xl
            bg-white/90 dark:bg-slate-900/80
            border border-slate-200 dark:border-slate-800
            text-sm text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60
            dark:focus:ring-teal-400/30 dark:focus:border-teal-400/60
            transition-shadow
          "
        />
      </div>

      <div
        className="
          inline-flex items-center gap-0.5 p-1
          rounded-xl
          bg-white/90 dark:bg-slate-900/80
          border border-slate-200 dark:border-slate-800
        "
        role="tablist"
        aria-label="Modo de visualização"
      >
        <button
          type="button"
          role="tab"
          aria-selected={view === 'list'}
          aria-label="Visualização em lista"
          onClick={() => onViewChange('list')}
          className={`
            grid place-items-center w-8 h-8 rounded-lg transition-colors
            ${
              view === 'list'
                ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }
          `}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'grid'}
          aria-label="Visualização em grid"
          onClick={() => onViewChange('grid')}
          className={`
            grid place-items-center w-8 h-8 rounded-lg transition-colors
            ${
              view === 'grid'
                ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }
          `}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
