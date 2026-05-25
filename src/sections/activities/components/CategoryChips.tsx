import {
  Layers,
  HeartPulse,
  Dumbbell,
  Activity,
  Award,
  Heart,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { ActivityCategory, ActivityCategoryKey } from '@/../product/sections/activities/types'

export interface CategoryChipsProps {
  categories: ActivityCategory[]
  activeKey: ActivityCategoryKey
  onChange: (key: ActivityCategoryKey) => void
}

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  'heart-pulse': HeartPulse,
  dumbbell: Dumbbell,
  activity: Activity,
  award: Award,
  heart: Heart,
  'more-horizontal': MoreHorizontal,
}

export function CategoryChips({ categories, activeKey, onChange }: CategoryChipsProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin"
      role="tablist"
      aria-label="Categorias de atividade"
    >
      {categories.map((cat) => {
        const Icon = ICONS[cat.icon] ?? Layers
        const active = cat.key === activeKey
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.key)}
            className={`
              shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-xs font-medium transition-colors border
              ${
                active
                  ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:text-slate-950 dark:border-teal-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
