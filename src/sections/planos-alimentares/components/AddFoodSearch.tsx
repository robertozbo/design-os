import { useEffect, useRef, useState } from 'react'
import { Plus, Search, Sparkles } from 'lucide-react'
import type { AlimentoLite } from '@/../product/sections/planos-alimentares/types'

interface AddFoodSearchProps {
  alimentos: AlimentoLite[]
  /** IDs already in this meal (skipped from suggestions). */
  excludeIds: string[]
  onAdd: (alimentoId: string, defaultGrams: number) => void
}

const MAX_RESULTS = 6

export function AddFoodSearch({ alimentos, excludeIds, onAdd }: AddFoodSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    function handlePointer(e: PointerEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('pointerdown', handlePointer, true)
    document.addEventListener('keydown', handleKey)
    inputRef.current?.focus()
    return () => {
      document.removeEventListener('pointerdown', handlePointer, true)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const exclude = new Set(excludeIds)
  const q = query.trim().toLowerCase()
  const results = alimentos
    .filter((a) => !exclude.has(a.id))
    .filter((a) => !q || a.name.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/40 px-3 py-2 text-xs font-medium text-slate-500
          transition-all hover:border-teal-400 hover:bg-teal-50/40 hover:text-teal-700
          dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300
        "
      >
        <Plus size={13} strokeWidth={2.5} />
        Adicionar alimento
      </button>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search
          size={13}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar alimento por nome…"
          className="
            block w-full rounded-lg border border-teal-400 bg-white py-2 pl-9 pr-3 text-sm text-slate-900
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-teal-400/20
            dark:border-teal-600 dark:bg-slate-900 dark:text-slate-50
          "
        />
      </div>

      {/* Results dropdown */}
      <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        {results.length > 0 ? (
          <ul className="max-h-72 overflow-y-auto py-1">
            {results.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(a.id, a.defaultPortion.grams)
                    setQuery('')
                    setOpen(false)
                  }}
                  className="
                    flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors
                    hover:bg-teal-50 dark:hover:bg-teal-900/20
                  "
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                        {a.name}
                      </span>
                      {a.source === 'custom' && (
                        <Sparkles size={9} className="shrink-0 text-teal-500" />
                      )}
                    </div>
                    <div className="font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
                      {a.kcalPer100g} kcal/100g · porção {a.defaultPortion.label} ({a.defaultPortion.grams}g)
                    </div>
                  </div>
                  <span
                    className={`
                      shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider
                      ${
                        a.source === 'custom'
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }
                    `}
                  >
                    {a.source === 'custom' ? 'Custom' : 'TBCA'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Nenhum alimento encontrado para "{query}".
          </div>
        )}
      </div>
    </div>
  )
}
