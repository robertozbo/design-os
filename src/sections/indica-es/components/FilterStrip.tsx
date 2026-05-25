import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type {
  FiltroEstado,
  FiltroEstadoId,
  SortId,
  SortOpcao,
} from '@/../product/sections/indica-es/types'

interface FilterStripProps {
  filtros: FiltroEstado[]
  selectedEstado: FiltroEstadoId
  onEstadoChange: (id: FiltroEstadoId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedSort: SortId
  sortOptions: SortOpcao[]
  onSortChange: (sort: SortId) => void
}

export function FilterStrip({
  filtros,
  selectedEstado,
  onEstadoChange,
  searchQuery,
  onSearchChange,
  selectedSort,
  sortOptions,
  onSortChange,
}: FilterStripProps) {
  return (
    <div className="space-y-3">
      {/* Search + Sort */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone…"
            className="
              block w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900
              placeholder:text-slate-400
              focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-600
            "
          />
        </div>
        <SortDropdown
          options={sortOptions}
          selected={selectedSort}
          onChange={onSortChange}
        />
      </div>

      {/* State pills */}
      <div className="flex flex-wrap gap-1.5">
        {filtros.map((f) => {
          const active = selectedEstado === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onEstadoChange(f.id)}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition
                ${active
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
              `}
            >
              {f.label}
              <span
                className={`
                  rounded-full px-1.5 py-px text-[10px] font-mono tabular-nums
                  ${active
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-white text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                `}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SortDropdown({
  options,
  selected,
  onChange,
}: {
  options: SortOpcao[]
  selected: SortId
  onChange: (s: SortId) => void
}) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.id === selected) ?? options[0]
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700
          hover:bg-slate-50
          dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
        "
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Ordenar
        </span>
        <span>{current?.label}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="
              absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl
              border border-slate-200 bg-white shadow-lg
              dark:border-slate-800 dark:bg-slate-900
            "
          >
            <ul className="py-1">
              {options.map((opt) => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.id)
                      setOpen(false)
                    }}
                    className={`
                      flex w-full items-center px-3 py-1.5 text-left text-xs transition
                      hover:bg-teal-50 hover:text-teal-700
                      dark:hover:bg-teal-950/40 dark:hover:text-teal-200
                      ${opt.id === selected
                        ? 'bg-teal-50 font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
