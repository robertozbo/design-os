import {
  Activity,
  Dumbbell,
  Apple,
  FlaskConical,
  Scale,
  Brain,
  Target,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import type {
  DataCategory,
  DataCategoryKey,
} from '@/../product/sections/my-professionals/types'

const CAT_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  dumbbell: Dumbbell,
  apple: Apple,
  'flask-conical': FlaskConical,
  scale: Scale,
  brain: Brain,
  target: Target,
}

export interface ConsentCategoriesPickerProps {
  categories: DataCategory[]
  selected: DataCategoryKey[]
  recommended: DataCategoryKey[]
  onChange: (selected: DataCategoryKey[]) => void
  compact?: boolean
  /**
   * When true: the picker is shown as a teaser ("Em breve"). All toggles
   * appear ON but cannot be changed; onChange is never called.
   * Communicates the upcoming granular control without lying about state.
   */
  comingSoon?: boolean
}

export function ConsentCategoriesPicker({
  categories,
  selected,
  recommended,
  onChange,
  compact = false,
  comingSoon = false,
}: ConsentCategoriesPickerProps) {
  // When comingSoon: force all categories as "selected" visually.
  const effectiveSelected = comingSoon
    ? new Set(categories.map((c) => c.key))
    : new Set(selected)
  const recommendedSet = new Set(recommended)

  const toggle = (key: DataCategoryKey) => {
    if (comingSoon) return
    const next = new Set(effectiveSelected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange(Array.from(next))
  }

  const selectAll = () => {
    if (comingSoon) return
    onChange(categories.map((c) => c.key))
  }
  const clearAll = () => {
    if (comingSoon) return
    onChange([])
  }

  return (
    <div className="flex flex-col gap-3">
      {comingSoon && (
        <div
          className="
            flex items-start gap-2 p-3 rounded-xl
            bg-amber-500/5 dark:bg-amber-400/5
            border border-amber-500/20 dark:border-amber-400/20
          "
        >
          <div className="grid place-items-center w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Controle granular em breve
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.12em] font-semibold bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                Em breve
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Por enquanto o profissional vinculado vê todas as categorias de
              dados ativos. Em breve você poderá escolher exatamente o que
              compartilhar.
            </p>
          </div>
        </div>
      )}

      <ul className={`flex flex-col gap-1.5 ${comingSoon ? 'opacity-70' : ''}`}>
        {categories.map((cat) => {
          const Icon = CAT_ICONS[cat.icon] ?? Activity
          const checked = effectiveSelected.has(cat.key)
          const isRecommended = recommendedSet.has(cat.key)
          const disabled = comingSoon
          return (
            <li key={cat.key}>
              <button
                type="button"
                onClick={() => toggle(cat.key)}
                aria-pressed={checked}
                aria-disabled={disabled}
                disabled={disabled}
                className={`
                  group w-full flex items-start gap-3 text-left
                  ${compact ? 'p-3' : 'p-3.5'} rounded-xl
                  border transition-all
                  ${disabled ? 'cursor-not-allowed' : ''}
                  ${
                    checked
                      ? 'bg-teal-500/5 dark:bg-teal-400/5 border-teal-500/30 dark:border-teal-400/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                <div
                  className={`
                    shrink-0 grid place-items-center w-9 h-9 rounded-lg
                    ${
                      checked
                        ? 'bg-teal-500/15 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {cat.label}
                    </span>
                    {isRecommended && !comingSoon && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-[0.12em] font-semibold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                        Recomendado
                      </span>
                    )}
                  </div>
                  {!compact && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div
                  className={`
                    shrink-0 relative w-9 h-5 rounded-full
                    transition-colors
                    ${
                      checked
                        ? 'bg-teal-600 dark:bg-teal-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }
                  `}
                  aria-hidden="true"
                >
                  <span
                    className={`
                      absolute top-0.5 w-4 h-4 rounded-full bg-white
                      shadow-sm
                      transition-[left] duration-200
                      ${checked ? 'left-[18px]' : 'left-0.5'}
                    `}
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      {!comingSoon && (
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {selected.length} de {categories.length} categorias
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="
                text-teal-700 dark:text-teal-300 font-medium
                hover:underline
                transition-colors
              "
            >
              Selecionar tudo
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={clearAll}
              className="
                text-slate-500 dark:text-slate-400 font-medium
                hover:text-slate-700 dark:hover:text-slate-200
                transition-colors
              "
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
