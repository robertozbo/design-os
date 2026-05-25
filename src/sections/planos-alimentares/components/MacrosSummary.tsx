import { AlertTriangle, Flame } from 'lucide-react'
import type {
  AlimentoLite,
  Meal,
  PlanoTargets,
} from '@/../product/sections/planos-alimentares/types'

interface MacrosSummaryProps {
  meals: Meal[]
  alimentosById: Record<string, AlimentoLite>
  targets: PlanoTargets | null
  onTargetsChange?: (next: PlanoTargets) => void
}

const ZERO_TARGETS: PlanoTargets = { kcal: 0, protein: 0, carb: 0, fat: 0, fiber: 0 }

function fmt(n: number, frac = 0) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: frac })
}

export function MacrosSummary({ meals, alimentosById, targets, onTargetsChange }: MacrosSummaryProps) {
  const totals = meals.reduce(
    (acc, meal) => {
      for (const item of meal.items) {
        const a = alimentosById[item.alimentoId]
        if (!a) continue
        const factor = item.grams / 100
        acc.kcal += a.kcalPer100g * factor
        acc.protein += a.proteinPer100g * factor
        acc.carb += a.carbPer100g * factor
        acc.fat += a.fatPer100g * factor
        acc.fiber += a.fiberPer100g * factor
      }
      return acc
    },
    { kcal: 0, protein: 0, carb: 0, fat: 0, fiber: 0 },
  )

  const t = targets ?? ZERO_TARGETS
  const hasTargets = !!targets

  function updateTarget<K extends keyof PlanoTargets>(key: K, value: number) {
    onTargetsChange?.({ ...t, [key]: value })
  }

  function pctOf(actual: number, target: number) {
    if (!target) return 0
    return (actual / target) * 100
  }

  // Warning if any macro >110% of target
  const overshooting =
    hasTargets &&
    (pctOf(totals.kcal, t.kcal) > 110 ||
      pctOf(totals.protein, t.protein) > 110 ||
      pctOf(totals.carb, t.carb) > 110 ||
      pctOf(totals.fat, t.fat) > 110)

  return (
    <aside className="lg:sticky lg:top-[88px] space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Resumo do dia
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <Flame size={18} className="text-orange-500" />
          <div>
            <span className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {fmt(totals.kcal)}
            </span>
            <span className="ml-1 font-mono text-xs text-slate-400 dark:text-slate-500">kcal</span>
          </div>
        </div>
        {hasTargets && (
          <div className="mt-1 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
            de <span className="text-slate-700 dark:text-slate-300">{fmt(t.kcal)}</span> kcal/dia
          </div>
        )}
      </header>

      {/* Overshoot warning */}
      {overshooting && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-200">
          <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Algum macro está acima de 110% da meta.</span>
        </div>
      )}

      {/* Macro bars */}
      {hasTargets ? (
        <div className="space-y-3">
          <MacroBar label="Proteína" actual={totals.protein} target={t.protein} unit="g" tone="rose" />
          <MacroBar label="Carboidrato" actual={totals.carb} target={t.carb} unit="g" tone="amber" />
          <MacroBar label="Gordura" actual={totals.fat} target={t.fat} unit="g" tone="violet" />
          <MacroBar label="Fibra" actual={totals.fiber} target={t.fiber} unit="g" tone="emerald" />
        </div>
      ) : (
        <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Defina metas diárias para acompanhar o equilíbrio dos macros.
          </p>
          <button
            type="button"
            onClick={() =>
              onTargetsChange?.({
                kcal: Math.round(totals.kcal) || 2000,
                protein: Math.round(totals.protein) || 100,
                carb: Math.round(totals.carb) || 250,
                fat: Math.round(totals.fat) || 65,
                fiber: Math.round(totals.fiber) || 25,
              })
            }
            className="w-full rounded-md border border-teal-300 bg-teal-50 px-2 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50"
          >
            Definir metas
          </button>
        </div>
      )}

      {/* Targets editor (collapsible-ish) */}
      {hasTargets && onTargetsChange && (
        <details className="group rounded-xl border border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40">
          <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            Editar metas
            <span className="ml-1 transition-transform group-open:rotate-90">▸</span>
          </summary>
          <div className="grid grid-cols-2 gap-2 px-3 pb-3">
            <TargetInput label="Kcal" value={t.kcal} unit="kcal" onChange={(v) => updateTarget('kcal', v)} />
            <TargetInput label="Proteína" value={t.protein} unit="g" onChange={(v) => updateTarget('protein', v)} />
            <TargetInput label="Carboidrato" value={t.carb} unit="g" onChange={(v) => updateTarget('carb', v)} />
            <TargetInput label="Gordura" value={t.fat} unit="g" onChange={(v) => updateTarget('fat', v)} />
            <TargetInput label="Fibra" value={t.fiber} unit="g" onChange={(v) => updateTarget('fiber', v)} />
          </div>
        </details>
      )}
    </aside>
  )
}

function MacroBar({
  label,
  actual,
  target,
  unit,
  tone,
}: {
  label: string
  actual: number
  target: number
  unit: string
  tone: 'rose' | 'amber' | 'violet' | 'emerald'
}) {
  const TONE: Record<typeof tone, { fill: string; text: string }> = {
    rose: { fill: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    amber: { fill: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    violet: { fill: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
    emerald: { fill: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  }
  const pct = target ? Math.min(150, (actual / target) * 100) : 0
  const isOver = pct > 110
  const isUnder = pct < 80
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className={`text-xs font-medium ${TONE[tone].text}`}>{label}</span>
        <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-50">{fmt(actual, 1)}</span>
          <span className="text-slate-400 dark:text-slate-500"> / {fmt(target, 0)}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all ${isOver ? 'bg-amber-500' : TONE[tone].fill}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <div className="mt-0.5 font-mono text-[9px] tabular-nums text-slate-400 dark:text-slate-500">
        {isOver ? `${Math.round(pct)}% — acima da meta` : isUnder ? `${Math.round(pct)}%` : `${Math.round(pct)}%`}
      </div>
    </div>
  )
}

function TargetInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string
  value: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            w-full rounded-md border border-slate-200 bg-white py-1 pl-2 pr-7 text-xs
            font-mono tabular-nums text-slate-900
            focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/30
            dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50
          "
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-400 dark:text-slate-500">
          {unit}
        </span>
      </div>
    </label>
  )
}
