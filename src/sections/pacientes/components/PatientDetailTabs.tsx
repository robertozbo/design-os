import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  Lock,
  MessageCircle,
  Ruler,
  TrendingUp,
  User,
  Utensils,
} from 'lucide-react'
import type { PatientTab, PlanTier, TabKey } from '@/../product/sections/pacientes/types'

interface PatientDetailTabsProps {
  tabs: PatientTab[]
  activeTab: TabKey
  currentPlan: PlanTier
  onTabChange?: (tab: TabKey) => void
}

const TAB_ICON: Record<string, typeof LayoutDashboard> = {
  'layout-dashboard': LayoutDashboard,
  'clipboard-list': ClipboardList,
  ruler: Ruler,
  utensils: Utensils,
  activity: Activity,
  'trending-up': TrendingUp,
  'message-circle': MessageCircle,
  user: User,
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function PatientDetailTabs({
  tabs,
  activeTab,
  currentPlan,
  onTabChange,
}: PatientDetailTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs do paciente"
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1.5"
    >
      {tabs.map((tab) => {
        const Icon = TAB_ICON[tab.icon] ?? LayoutDashboard
        const active = tab.id === activeTab
        const locked = PLAN_RANK[currentPlan] < PLAN_RANK[tab.planTierRequired]

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange?.(tab.id)}
            className={`group relative inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              active
                ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                : locked
                ? 'bg-white text-slate-400 ring-1 ring-slate-200 hover:text-orange-700 dark:bg-slate-900 dark:text-slate-500 dark:ring-slate-800 dark:hover:text-orange-300'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            }`}
          >
            {locked ? (
              <Lock size={12} className="text-orange-500 dark:text-orange-400" />
            ) : (
              <Icon size={14} />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && !locked && (
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  active
                    ? 'text-slate-300 dark:text-slate-500'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
            {locked && (
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {tab.planTierRequired}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
