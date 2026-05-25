import { X } from 'lucide-react'
import type {
  AlimentoLite,
  MealItem,
} from '@/../product/sections/planos-alimentares/types'

interface MealItemRowProps {
  item: MealItem
  alimento: AlimentoLite | undefined
  onChangeGrams: (grams: number) => void
  onRemove: () => void
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

export function MealItemRow({ item, alimento, onChangeGrams, onRemove }: MealItemRowProps) {
  if (!alimento) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
        <span>Alimento removido (id {item.alimentoId})</span>
        <button type="button" onClick={onRemove} aria-label="Remover">
          <X size={14} />
        </button>
      </li>
    )
  }

  const factor = item.grams / 100
  const kcal = alimento.kcalPer100g * factor
  const p = alimento.proteinPer100g * factor
  const c = alimento.carbPer100g * factor
  const f = alimento.fatPer100g * factor

  // Show "≈ N porções" only if grams is a multiple of the default portion (or close)
  const portionRatio = item.grams / alimento.defaultPortion.grams
  const portionLabel =
    Math.abs(portionRatio - Math.round(portionRatio)) < 0.05 && portionRatio > 0
      ? `≈ ${Math.round(portionRatio)}× ${alimento.defaultPortion.label}`
      : null

  function handleStep(delta: number) {
    onChangeGrams(Math.max(1, item.grams + delta))
  }

  return (
    <li className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/40">
      {/* Left: name + macros */}
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
            {alimento.name}
          </p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
          <span className="text-slate-700 dark:text-slate-300">{fmt(kcal)} kcal</span>
          <span className="text-rose-500 dark:text-rose-400">P {fmt(p)}g</span>
          <span className="text-amber-500 dark:text-amber-400">C {fmt(c)}g</span>
          <span className="text-violet-500 dark:text-violet-400">G {fmt(f)}g</span>
          {portionLabel && (
            <span className="text-slate-400 dark:text-slate-500">{portionLabel}</span>
          )}
        </div>
      </div>

      {/* Right: grams stepper + remove */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleStep(-10)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          aria-label="Diminuir 10g"
        >
          −
        </button>
        <div className="relative">
          <input
            type="number"
            min={1}
            value={item.grams}
            onChange={(e) => onChangeGrams(Math.max(1, Number(e.target.value)))}
            className="
              h-7 w-16 rounded-md border border-slate-200 bg-white pl-2 pr-5 text-right text-xs
              font-mono tabular-nums text-slate-900
              focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/30
              dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50
            "
          />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
            g
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleStep(10)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          aria-label="Aumentar 10g"
        >
          +
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
          aria-label="Remover alimento"
        >
          <X size={13} />
        </button>
      </div>
    </li>
  )
}
