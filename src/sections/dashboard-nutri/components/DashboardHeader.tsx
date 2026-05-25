import type { DashboardHeader as DashboardHeaderData, Nutri, TimeframeId } from '@/../product/sections/dashboard-nutri/types'

interface DashboardHeaderProps {
  nutri: Nutri
  header: DashboardHeaderData
  onTimeframeChange?: (timeframe: TimeframeId) => void
}

const PLAN_LABEL: Record<Nutri['plan'], { label: string; tone: string }> = {
  free: { label: 'Free', tone: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  plus: { label: 'Plus', tone: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
  pro: { label: 'Pro', tone: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
}

export function DashboardHeader({ nutri, header, onTimeframeChange }: DashboardHeaderProps) {
  const plan = PLAN_LABEL[nutri.plan]

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {header.currentDateLabel}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {header.greeting}
          </h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${plan.tone}`}
          >
            {plan.label}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {nutri.crn} · Painel da sua carteira
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Período do dashboard"
        className="inline-flex self-start rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        {header.timeframeOptions.map((option) => {
          const active = option.id === header.timeframe
          return (
            <button
              key={option.id}
              role="tab"
              aria-selected={active}
              onClick={() => onTimeframeChange?.(option.id)}
              className={`relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
