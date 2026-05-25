import { ArrowRight, Bell, CalendarPlus, ClipboardList, Lock, UserPlus } from 'lucide-react'
import type { PlanTier, QuickAction } from '@/../product/sections/dashboard-nutri/types'

interface QuickActionButtonProps {
  action: QuickAction
  currentPlan: PlanTier
  onClick?: () => void
}

const ICON_MAP: Record<string, typeof UserPlus> = {
  'user-plus': UserPlus,
  'calendar-plus': CalendarPlus,
  clipboard: ClipboardList,
  bell: Bell,
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function QuickActionButton({ action, currentPlan, onClick }: QuickActionButtonProps) {
  const locked = PLAN_RANK[currentPlan] < PLAN_RANK[action.planTierRequired]
  const Icon = ICON_MAP[action.icon] ?? UserPlus

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all ${
        locked
          ? 'border-dashed border-slate-300 bg-slate-50/40 hover:border-orange-300 hover:bg-orange-50/40 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-orange-700 dark:hover:bg-orange-900/10'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md hover:shadow-teal-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            locked
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
              : 'bg-teal-50 text-teal-700 group-hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300 dark:group-hover:bg-teal-900/60'
          }`}
        >
          <Icon size={16} />
        </span>
        <span
          className={`text-sm font-semibold ${
            locked
              ? 'text-slate-500 dark:text-slate-400'
              : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          {action.label}
        </span>
      </div>

      {locked ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
          <Lock size={10} />
          {action.planTierRequired}
        </span>
      ) : (
        <ArrowRight
          size={14}
          className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-600 dark:text-slate-600 dark:group-hover:text-teal-400"
        />
      )}
    </button>
  )
}
