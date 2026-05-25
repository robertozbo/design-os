import {
  UtensilsCrossed,
  FlaskConical,
  Dumbbell,
  Scale,
  Smile,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import type {
  AccentColor,
  QuickAction,
} from '@/../product/sections/dashboard/types'

export interface QuickActionsProps {
  actions: QuickAction[]
  revealIndex?: number
  onAction?: (action: QuickAction) => void
}

const ICONS: Record<string, LucideIcon> = {
  smile: Smile,
  utensils: UtensilsCrossed,
  'flask-conical': FlaskConical,
  dumbbell: Dumbbell,
  scale: Scale,
}

const ACCENT_TINT: Record<AccentColor, { bg: string; fg: string }> = {
  rose: { bg: 'bg-rose-500/10 dark:bg-rose-400/10', fg: 'text-rose-600 dark:text-rose-300' },
  teal: { bg: 'bg-teal-500/10 dark:bg-teal-400/10', fg: 'text-teal-600 dark:text-teal-300' },
  violet: { bg: 'bg-violet-500/10 dark:bg-violet-400/10', fg: 'text-violet-600 dark:text-violet-300' },
  amber: { bg: 'bg-amber-500/10 dark:bg-amber-400/10', fg: 'text-amber-600 dark:text-amber-300' },
  emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-400/10', fg: 'text-emerald-600 dark:text-emerald-300' },
  indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-400/10', fg: 'text-indigo-600 dark:text-indigo-300' },
  purple: { bg: 'bg-purple-500/10 dark:bg-purple-400/10', fg: 'text-purple-600 dark:text-purple-300' },
  sky: { bg: 'bg-sky-500/10 dark:bg-sky-400/10', fg: 'text-sky-600 dark:text-sky-300' },
}

export function QuickActions({
  actions,
  revealIndex = 0,
  onAction,
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, i) => {
        const Icon = ICONS[action.icon] ?? Plus
        const tint = ACCENT_TINT[action.accent]
        const isHighlighted = action.highlighted

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction?.(action)}
            style={{ animationDelay: `${80 * (revealIndex + i)}ms` }}
            className={`
              nymos-reveal opacity-0
              group flex items-center gap-3 text-left
              rounded-2xl p-4
              transition-[transform,box-shadow] duration-300 ease-out
              hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
              ${
                isHighlighted
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-500 dark:to-teal-600 text-white shadow-[0_8px_32px_-12px_rgba(20,184,166,0.6)] hover:shadow-[0_12px_40px_-12px_rgba(20,184,166,0.7)]'
                  : 'bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-[2px] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]'
              }
            `}
          >
            <div
              className={`
                shrink-0 grid place-items-center w-11 h-11 rounded-xl
                ${
                  isHighlighted
                    ? 'bg-white/15 text-white'
                    : `${tint.bg} ${tint.fg}`
                }
              `}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`text-sm font-semibold truncate ${
                  isHighlighted ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {action.label}
              </div>
              <div
                className={`text-[11px] truncate ${
                  isHighlighted
                    ? 'text-white/80'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {action.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
