import { useEffect, useRef, useState } from 'react'
import { Clock, MoreHorizontal, Trash2 } from 'lucide-react'
import type {
  AlimentoLite,
  Meal,
  MealItem,
} from '@/../product/sections/planos-alimentares/types'
import { AddFoodSearch } from './AddFoodSearch'
import { MealItemRow } from './MealItemRow'

interface MealCardProps {
  meal: Meal
  alimentos: AlimentoLite[]
  alimentosById: Record<string, AlimentoLite>
  onChange: (next: Meal) => void
  onRemove: () => void
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}

export function MealCard({ meal, alimentos, alimentosById, onChange, onRemove }: MealCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handlePointer(e: PointerEvent) {
      if (!cardRef.current) return
      if (!cardRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer, true)
    return () => document.removeEventListener('pointerdown', handlePointer, true)
  }, [menuOpen])

  // Compute meal totals
  const totals = meal.items.reduce(
    (acc, item) => {
      const a = alimentosById[item.alimentoId]
      if (!a) return acc
      const factor = item.grams / 100
      return {
        kcal: acc.kcal + a.kcalPer100g * factor,
        p: acc.p + a.proteinPer100g * factor,
        c: acc.c + a.carbPer100g * factor,
        f: acc.f + a.fatPer100g * factor,
      }
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  )

  function updateMeal(patch: Partial<Meal>) {
    onChange({ ...meal, ...patch })
  }

  function updateItem(itemId: string, patch: Partial<MealItem>) {
    onChange({
      ...meal,
      items: meal.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
    })
  }

  function removeItem(itemId: string) {
    onChange({ ...meal, items: meal.items.filter((it) => it.id !== itemId) })
  }

  function addFood(alimentoId: string, defaultGrams: number) {
    const newItem: MealItem = {
      id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      alimentoId,
      grams: defaultGrams,
    }
    onChange({ ...meal, items: [...meal.items, newItem] })
  }

  return (
    <article
      ref={cardRef}
      className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header: name + time + totals + menu */}
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <input
          type="text"
          value={meal.name}
          onChange={(e) => updateMeal({ name: e.target.value })}
          className="
            min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5
            text-sm font-semibold text-slate-900
            transition-colors hover:bg-slate-50 focus:border-slate-300 focus:bg-white focus:outline-none
            dark:text-slate-50 dark:hover:bg-slate-800/50 dark:focus:border-slate-600 dark:focus:bg-slate-950
          "
          aria-label="Nome da refeição"
        />

        {/* Time input */}
        <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          <Clock size={11} className="text-slate-400 dark:text-slate-500" />
          <input
            type="time"
            value={meal.time}
            onChange={(e) => updateMeal({ time: e.target.value })}
            className="bg-transparent font-mono text-xs tabular-nums text-slate-700 focus:outline-none dark:text-slate-300"
            aria-label="Horário"
          />
        </label>

        {/* Totals */}
        <div className="flex items-baseline gap-3 font-mono text-[10px] tabular-nums">
          <span className="text-slate-700 dark:text-slate-300">
            <span className="text-base font-semibold">{fmt(totals.kcal)}</span>
            <span className="ml-0.5 text-[9px] text-slate-400 dark:text-slate-500">kcal</span>
          </span>
          <span className="text-rose-500 dark:text-rose-400">P {fmt(totals.p)}g</span>
          <span className="text-amber-500 dark:text-amber-400">C {fmt(totals.c)}g</span>
          <span className="text-violet-500 dark:text-violet-400">G {fmt(totals.f)}g</span>
        </div>

        {/* Kebab */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`
              rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
              ${menuOpen ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''}
            `}
            aria-label="Mais ações"
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onRemove()
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
              >
                <Trash2 size={13} />
                Remover refeição
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Items */}
      <div className="space-y-2 px-4 py-4">
        {meal.items.length === 0 ? (
          <p className="px-1 py-2 text-center text-xs italic text-slate-400 dark:text-slate-500">
            Nenhum alimento adicionado ainda.
          </p>
        ) : (
          <ul className="space-y-2">
            {meal.items.map((item) => (
              <MealItemRow
                key={item.id}
                item={item}
                alimento={alimentosById[item.alimentoId]}
                onChangeGrams={(g) => updateItem(item.id, { grams: g })}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>
        )}

        <AddFoodSearch
          alimentos={alimentos}
          excludeIds={meal.items.map((it) => it.alimentoId)}
          onAdd={addFood}
        />
      </div>
    </article>
  )
}
