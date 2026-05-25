import {
  Layers,
  Apple,
  Dumbbell,
  Stethoscope,
  Heart,
  Brain,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import type {
  ProfessionalTypeChip,
  ProfessionalTypeKey,
} from '@/../product/sections/my-professionals/types'

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  apple: Apple,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
  heart: Heart,
  brain: Brain,
  'user-check': UserCheck,
}

export interface TypeChipsProps {
  types: ProfessionalTypeChip[]
  activeKey: ProfessionalTypeKey
  onChange: (key: ProfessionalTypeKey) => void
}

export function TypeChips({ types, activeKey, onChange }: TypeChipsProps) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1"
      role="tablist"
      aria-label="Tipos de profissional"
    >
      {types.map((t) => {
        const Icon = ICONS[t.icon] ?? Layers
        const active = t.key === activeKey
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
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
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
