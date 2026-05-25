import { Search, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import type {
  CategoriaFiltroId,
  CategoriaOpcao,
  SortId,
  SortOpcao,
  TagDieteticaId,
  TagOpcao,
} from '@/../product/sections/receitas/types'

interface FilterStripProps {
  categoriaOpcoes: CategoriaOpcao[]
  categoriaCount: Record<CategoriaFiltroId, number>
  selectedCategoria: CategoriaFiltroId
  onCategoriaChange: (id: CategoriaFiltroId) => void

  tagOpcoes: TagOpcao[]
  selectedTags: TagDieteticaId[]
  onTagsChange: (tags: TagDieteticaId[]) => void

  searchQuery: string
  onSearchChange: (q: string) => void

  sortOptions: SortOpcao[]
  selectedSort: SortId
  onSortChange: (s: SortId) => void

  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function FilterStrip({
  categoriaOpcoes,
  categoriaCount,
  selectedCategoria,
  onCategoriaChange,
  tagOpcoes,
  selectedTags,
  onTagsChange,
  searchQuery,
  onSearchChange,
  sortOptions,
  selectedSort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: FilterStripProps) {
  function toggleTag(id: TagDieteticaId) {
    const next = selectedTags.includes(id)
      ? selectedTags.filter((t) => t !== id)
      : [...selectedTags, id]
    onTagsChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Search + sort row */}
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
            placeholder="Buscar por nome, ingrediente ou tag…"
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

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {categoriaOpcoes.map((c) => {
          const active = selectedCategoria === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategoriaChange(c.id)}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition
                ${active
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
              `}
            >
              {c.label}
              <span
                className={`
                  rounded-full px-1.5 py-px text-[10px] font-mono tabular-nums
                  ${active
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-white text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                `}
              >
                {categoriaCount[c.id] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
          Tags
        </span>
        {tagOpcoes.map((t) => {
          const active = selectedTags.includes(t.id)
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.id)}
              className={`
                inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition
                ${active
                  ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-800'}
              `}
            >
              {t.label}
            </button>
          )
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="
              ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium
              text-slate-500 hover:bg-slate-100 hover:text-slate-700
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
          >
            <X size={11} />
            Limpar filtros
          </button>
        )}
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
