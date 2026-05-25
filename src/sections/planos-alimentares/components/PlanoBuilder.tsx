import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import type {
  Meal,
  PlanoBuilderProps,
  PlanoFull,
} from '@/../product/sections/planos-alimentares/types'
import { BuilderHeader } from './BuilderHeader'
import { MacrosSummary } from './MacrosSummary'
import { MealCard } from './MealCard'

export function PlanoBuilder({
  plano,
  patients,
  alimentos,
  defaultMealNames,
  objetivoOptions,
  onPlanoChange,
  onBack,
  onSaveDraft,
  onPublish,
  onDuplicate,
  onArchive,
  onDelete,
  onToggleFavorite,
}: PlanoBuilderProps) {
  const patient = patients.find((p) => p.id === plano.patientId)

  const alimentosById = useMemo(
    () => Object.fromEntries(alimentos.map((a) => [a.id, a])),
    [alimentos],
  )

  function update(patch: Partial<PlanoFull>) {
    onPlanoChange?.({ ...plano, ...patch })
  }

  function updateMeal(mealId: string, next: Meal) {
    update({ meals: plano.meals.map((m) => (m.id === mealId ? next : m)) })
  }

  function removeMeal(mealId: string) {
    update({ meals: plano.meals.filter((m) => m.id !== mealId) })
  }

  function addMeal() {
    const nextNameIdx = plano.meals.length
    const baseName = defaultMealNames[nextNameIdx] ?? `Refeição ${nextNameIdx + 1}`
    const lastTime = plano.meals[plano.meals.length - 1]?.time ?? '07:00'
    // Add 2:30h to last time as default
    const [h, m] = lastTime.split(':').map(Number)
    const totalMin = h * 60 + m + 150
    const newTime = `${Math.floor(totalMin / 60)
      .toString()
      .padStart(2, '0')}:${(totalMin % 60).toString().padStart(2, '0')}`
    const newMeal: Meal = {
      id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: baseName,
      time: newTime,
      items: [],
    }
    update({ meals: [...plano.meals, newMeal] })
  }

  return (
    <div
      data-nymos-builder
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <BuilderHeader
        plano={plano}
        patient={patient}
        objetivoOptions={objetivoOptions}
        onChangeName={(name) => update({ name })}
        onChangeObjetivo={(objetivo) => update({ objetivo })}
        onToggleFavorite={onToggleFavorite}
        onBack={onBack}
        onDuplicate={onDuplicate}
        onArchive={onArchive}
        onDelete={onDelete}
      />

      {/* Body: meals + sidebar */}
      <div
        className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-8"
      >
        {/* Meals */}
        <div className="space-y-4">
          {plano.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              alimentos={alimentos}
              alimentosById={alimentosById}
              onChange={(next) => updateMeal(meal.id, next)}
              onRemove={() => removeMeal(meal.id)}
            />
          ))}

          <button
            type="button"
            onClick={addMeal}
            className="
              flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/40 px-4 py-4 text-sm font-medium text-slate-600
              transition-all hover:border-teal-400 hover:bg-teal-50/30 hover:text-teal-700
              dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300
            "
          >
            <Plus size={16} strokeWidth={2.5} />
            Adicionar refeição
          </button>
        </div>

        {/* Sidebar */}
        <MacrosSummary
          meals={plano.meals}
          alimentosById={alimentosById}
          targets={plano.targets}
          onTargetsChange={(t) => update({ targets: t })}
        />
      </div>

      {/* Sticky footer */}
      <footer className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span className="tabular-nums text-slate-700 dark:text-slate-300">
              {plano.meals.length}
            </span>{' '}
            refeição{plano.meals.length === 1 ? '' : 'es'} ·{' '}
            <span className="tabular-nums text-slate-700 dark:text-slate-300">
              {plano.meals.reduce((acc, m) => acc + m.items.length, 0)}
            </span>{' '}
            alimentos
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              onClick={onPublish}
              className="
                rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all
                hover:bg-teal-700 active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                dark:focus:ring-offset-slate-950
              "
            >
              Publicar plano
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
