import type { ReferralTab, ReferralSummary } from '@/../product/sections/encaminhamento-cl-nico/types'
import { TAB_META, TAB_ORDER } from './utils'

interface StatusTabsProps {
  active: ReferralTab
  summary: ReferralSummary
  onChange: (tab: ReferralTab) => void
}

const COUNT_KEY: Record<ReferralTab, keyof ReferralSummary> = {
  sugestoes: 'sugestoes',
  aguardando: 'aguardando',
  em_atendimento: 'emAtendimento',
  concluidos: 'concluidos',
}

export function StatusTabs({ active, summary, onChange }: StatusTabsProps) {
  return (
    <div
      role="tablist"
      className="
        flex items-stretch gap-1
        rounded-xl p-1
        bg-slate-100 dark:bg-slate-800/60
        ring-1 ring-slate-200 dark:ring-slate-800
        overflow-x-auto
      "
    >
      {TAB_ORDER.map((tab) => {
        const isActive = active === tab
        const count = summary[COUNT_KEY[tab]]
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab)}
            className={`
              shrink-0 inline-flex items-center gap-2
              px-3 sm:px-3.5 py-2 rounded-lg
              text-xs sm:text-sm font-medium
              transition-all duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
              ${isActive
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm shadow-slate-900/5'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'}
            `}
          >
            {TAB_META[tab].label}
            <span
              className={`
                inline-flex items-center justify-center
                min-w-[20px] h-5 px-1.5 rounded-full
                text-[11px] font-semibold tabular-nums
                ${isActive
                  ? 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}
              `}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
